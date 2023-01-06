# How to Zip(Extract) / Unzip(Compressed) files

## Zip/Unzip with tar
```
man tar
```
Tar supports a vast range of compression programs such as gzip, bzip2, lzip, lzma, lzop, xz and compress  
When creating compressed tar archives, it is an accepted convention to append the compressor suffix to the archive file name. For example, if an archive has been compressed with gzip , it should be named archive.tar.gz.
## Creating Tar Archive
For example, to create an archive named archive.tar from the files named file1, file2, file3, you would run the following command:

```
tar -cf archive.tar file1 file2 file3
```

Here is the equivalent command using the long-form options:
```
tar --create --file=archive.tar file1 file2 file3
```
Creating Tar Gz Archive : z option
The -z option tells tar to compress the archive using the gzip algorithm as it is created. For example, to create a tar.gz archive from given files, you would run the following command:

## Extracting Tar Archive
```
tar -xvf archive.tar
```
### Extracting Tar Archive in a Different Directory
```
tar -xf archive.tar -C /opt/files
```

### Tar Gz File


### Tar Xz File (*.tar.xz)

### First basic zip command 
`zip` command


