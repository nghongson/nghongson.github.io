![[Pasted image 20240608100707.png]]

OAuth allows different flows (processes), such as:

Authorization Code Flow — To be used for server-side applications, it acquires an authorization code to exchange for an access token, ensuring the client never exposes the tokens to the user-agent.
Implicit Flow — Previously used for client-side applications like SPAs, it directly returns an access token upon authorization but lacks refresh tokens and is less recommended due to security issues. It is deprecated due to security weaknesses.
Resource Owner Password Credentials Flow — This flow allows the client to use the resource owner’s username and password directly, which is suitable for highly trusted or legacy applications but is discouraged due to security risks.
Client Credentials Flow — For server-to-server authentication, a client can use its credentials instead of impersonating a user to obtain an access token.
Refresh Token Flow — When an access token expires, the client can obtain a new token using a refresh token without user interaction.
Device Code Flow — Designed for devices with limited input capabilities, it involves the user authorizing the device on a secondary device, following which the primary device gets the access token.
Extension Flow — A catch-all for custom flows, allowing for adaptations of the OAuth 2.0 protocol to cater to specific needs or scenarios not covered by other predefined flows.
Usually, use cases for OAuth 2.0 usage are:

Third-Party Access — Users can grant third-party applications limited access to their resources without sharing their credentials, like allowing a photo printing service access to photos stored in a cloud service.
For example, A user allows a scheduling app to access their Google Calendar to automatically set up meetings without sharing their Google credentials.

Single Sign-On (SSO) — It facilitates Single Sign-On (SSO), where users can log in to multiple services using a single ID, streamlining the authentication process across platforms and services.