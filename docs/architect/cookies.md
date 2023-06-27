# Cookies 

SameSite cookie restrictions
SameSite is a browser security mechanism that determines when a website's cookies are included in requests originating from other websites. SameSite cookie restrictions provide partial protection against a variety of cross-site attacks, including CSRF, cross-site leaks, and some CORS exploits.

What is a site in the context of SameSite cookies?
In the context of SameSite cookie restrictions, a site is defined as the top-level domain (TLD), usually something like .com or .net, plus one additional level of the domain name. This is often referred to as the TLD+1.

When determining whether a request is same-site or not, the URL scheme is also taken into consideration. This means that a link from http://app.example.com to https://app.example.com is treated as cross-site by most browsers.

The difference between a site and an origin is their scope; a site encompasses multiple domain names, whereas an origin only includes one. Although they're closely related, it's important not to use the terms interchangeably as conflating the two can have serious security implications.

Two URLs are considered to have the same origin if they share the exact same scheme, domain name, and port. Although note that the port is often inferred from the scheme.


Request from | Request to | Same-site? | Same-origin?
-------------|------------|------------|-------------
https://example.com	| https://example.com	| Yes | Yes
https://app.example.com | https://intranet.example.com | Yes |No: mismatched domain name
https://example.com | https://example.com:8080 | Yes | No: mismatched port
https://example.com	| https://example.co.uk	| No: mismatched eTLD | No: mismatched domain name
https://example.com | http://example.com | No: mismatched scheme | No: mismatched scheme
