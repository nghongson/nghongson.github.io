# Cookies 

SameSite cookie restrictions
SameSite is a browser security mechanism that determines when a website's cookies are included in requests originating from other websites. SameSite cookie restrictions provide partial protection against a variety of cross-site attacks, including CSRF, cross-site leaks, and some

CORS exploits.

What is a site in the context of SameSite cookies?
In the context of SameSite cookie restrictions, a site is defined as the top-level domain (TLD), usually something like .com or .net, plus one additional level of the domain name. This is often referred to as the TLD+1.

When determining whether a request is same-site or not, the URL scheme is also taken into consideration. This means that a link from http://app.example.com to https://app.example.com is treated as cross-site by most browsers.

The difference between a site and an origin is their scope; a site encompasses multiple domain names, whereas an origin only includes one. Although they're closely related, it's important not to use the terms interchangeably as conflating the two can have serious security implications.

Two URLs are considered to have the same origin if they share the exact same scheme, domain name, and port. Although note that the port is often inferred from the scheme.


| Request from            | Request to                   | Same-site?            | Same-origin?               |
| ----------------------- | ---------------------------- | --------------------- | -------------------------- |
| https://example.com     | https://example.com          | Yes                   | Yes                        |
| https://app.example.com | https://intranet.example.com | Yes                   | No: mismatched domain name |
| https://example.com     | https://example.com:8080     | Yes                   | No: mismatched port        |
| https://example.com     | https://example.co.uk        | No: mismatched eTLD   | No: mismatched domain name |
| https://example.com     | http://example.com           | No: mismatched scheme | No: mismatched scheme      |

How does SameSite work?
Before the SameSite mechanism was introduced, browsers sent cookies in every request to the domain that issued them, even if the request was triggered by an unrelated third-party website. SameSite works by enabling browsers and website owners to limit which cross-site requests, if any, should include specific cookies.
This can help to reduce users' exposure to CSRF attacks, which induce the victim's browser to issue a request that triggers a harmful action on the vulnerable website.
All major browsers currently support the following SameSite restriction levels:
- Strict 
- Lax 
- None 

To do this, they just have to include the SameSite attribute in the Set-Cookie response header, along with their preferred value:
`Set-Cookie: session=0F8tgdOhi9ynR1M9wa3ODa; SameSite=Strict`

Strict
If a cookie is set with the SameSite=Strict attribute, browsers will not send it in any cross-site requests.

Lax
Lax SameSite restrictions mean that browsers will send the cookie in cross-site requests, but only if both of the following conditions are met
- The request uses the GET method.
- The request resulted from a top-level navigation by the user, such as clicking on a link.

This means that the cookie is not included in cross-site POST requests,

None
If a cookie is set with the SameSite=None attribute, this effectively disables SameSite restrictions altogether, regardless of the browser. As a result, browsers will send this cookie in all requests to the site that issued it, even those that were triggered by completely unrelated third-party sites.
