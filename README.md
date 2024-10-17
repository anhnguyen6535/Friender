### Requirements
1. Install nvm (Node Version Manager) for [Windows](https://github.com/coreybutler/nvm-windows) or [Linux/MacOS](https://github.com/nvm-sh/nvm)
2. Install Node.JS using NVM (`nvm install latest`)
3. Install Ionic CLI globally (`npm install -g @ionic/cli`)
4. Clone the repo (`git clone <repo-url>`)
5. Install project dependencies `npm install`


### Run on Desktop only
1. Serve the webpage on desktop only using `ionic serve`
3. Visit it by going to http://localhost:8100

### Access from Mobile and Desktop
1. Find your machine IP address [Windows] (in Command Prompt: `ipconfig`) or [Linux/MacOS] (in Terminal: `ifconfig`)
2. Copy your IPv4 Address
3. ionic serve --host=<IP address>
4. Access on your phone by navigating to `http://<IP address>:8100/`

* Note: 
- Ensure that your mobile device is connected to the same Wi-Fi network as your computer to access the app.
- If you encounter any firewall issues, make sure to allow traffic on port 8100.