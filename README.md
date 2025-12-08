# EasyVote

EasyVote is a Chrome extension to make voting for your favorite gaming server easy.

## Video Guide

[![EasyVote Video Guide](https://img.youtube.com/vi/ZYVUVN378_g/mqdefault.jpg)](https://www.youtube.com/watch?v=ZYVUVN378_g)
 
## How to Install

Follow this link for step-by-step instructions for installing this unpacked extension

[Load an unpacked extension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked)


## Example flow

The final screen can either end with `/confirm/` or `/?error=...`

1. SALTY ZOMBIES 7D2D SERVERS          | https://7daystodie-servers.com/server/115464/
2. Vote for SALTY ZOMBIES 7D2D SERVERS | https://7daystodie-servers.com/server/115464/vote/
3. Steam Community                     | https://steamcommunity.com/openid/login
4. Vote for SALTY ZOMBIES 7D2D SERVERS | https://7daystodie-servers.com/server/115464/vote/?error=2&time=1765066554&fallbackcaptcha=


## Version History

### 1.0.3

* Added 'tabs' permission to be able to refer to all the voting pages on all of the tabs.
* The extension will now single thread matching hosts to avoid authentication cookie issues.
* Split the script files into common, steam, and vote.