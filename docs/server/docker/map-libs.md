Using the principle of "Only Install Required Runtime Libraries" is a critical step in minimizing the final Docker image size, especially when moving from a large **builder** image to a small **runtime** image (like `bookworm-slim` or `alpine`).

The core idea is to find out exactly which shared libraries (`.so` files) your compiled PHP extensions depend on, and then only install the Debian packages that provide those specific libraries in the final image.

Here is the step-by-step process for implementing this:

## 1\. 🔍 Identify Dependencies Using `ldd`

The `ldd` command is the standard Linux utility for printing the shared library dependencies of executable files or shared libraries. You must run this command in your **`builder`** stage.

In your `builder` stage, execute a `RUN` command to list dependencies for all compiled PHP extensions (`.so` files):

```dockerfile
# Inside the 'builder' stage, after extensions are installed
RUN set -eux; \
    extDir="$(php -r 'echo ini_get("extension_dir");'); \
    ldd "$extDir"/*.so \
    > /tmp/extension_deps.txt
```

This command saves the dependency list to `/tmp/extension_deps.txt` inside the `builder` image. A line in this file will look something like this:

```
/usr/local/lib/php/extensions/no-debug-non-zts-20220829/gd.so:
        libjpeg.so.62 => /usr/lib/x86_64-linux-gnu/libjpeg.so.62 (0x00007f3521d1d000)
        libpng16.so.16 => /usr/lib/x86_64-linux-gnu/libpng16.so.16 (0x00007f3521cf6000)
        libz.so.1 => /usr/lib/x86_64-linux-gnu/libz.so.1 (0x00007f3521c7d000)
        ...
```

The critical piece of information is the name of the library (e.g., `libjpeg.so.62`, `libpng16.so.16`).

---

## 2\. 🏷️ Map Libraries to Debian Packages

Next, still inside your **`builder`** stage (before final cleanup), use `dpkg-query` to find the exact Debian packages that own those libraries.

You already have a highly optimized section in your original Dockerfile that does this. I've broken it down for clarity:

```dockerfile
# Inside the 'builder' stage
# ... (after extension installation and cleanup) ...

# 1. Run ldd on all compiled extensions (.so files)
ldd "$extDir"/*.so \
| awk '/=>/ { so = $(NF-1); if (index(so, "/usr/local/") == 1) { next }; gsub("^/(usr/)?", "", so); printf "*%s\n", so }' \
| sort -u \
# 2. Use dpkg-query to find which package provides the library file path
| xargs -r dpkg-query --search \
| cut -d: -f1 \
| sort -u \
# 3. Mark the providing packages as 'manually installed' to prevent auto-removal
| xargs -rt apt-mark manual;
```

This block extracts the names of the **runtime packages** (like `libjpeg62-turbo`, `libpng16-16`) and ensures they are _not_ automatically removed during the final build-time cleanup.

The names of these packages are the ones you need to install in the final `runtime` stage.

---

## 3\. 🚀 Install Only Runtime Packages in the `final` Stage

Now, when you define your slim `final` stage, you use the list of packages derived in step 2 to install **only** those necessary runtime dependencies.

```dockerfile
# ----------------------------------------------------
# STAGE 2: Runtime (final)
# ----------------------------------------------------
FROM php:8.3-fpm-bookworm AS final

# Define the list of ONLY the required runtime packages here:
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
        # Example of packages found via ldd/dpkg-query in the builder:
        libjpeg62-turbo \
        libpng16-16 \
        libxslt1.1 \
        libicu72 \
        # Add any other non-extension utilities needed (e.g., git, unzip if required by runtime)
    ; \
    # CRITICAL: Final Cleanup
    apt-get clean; \
    rm -rf /var/lib/apt/lists/*;

# Copy compiled extensions from the builder
COPY --from=builder /usr/local/lib/php/extensions/ /usr/local/lib/php/extensions/

# ... rest of your Dockerfile ...
```

By manually curating this list, you ensure you skip installing hundreds of megabytes of unnecessary development files and build tools, resulting in a dramatically smaller final image.
