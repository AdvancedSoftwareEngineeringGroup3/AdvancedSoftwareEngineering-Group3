# Client

To set up this project:
Download Expo Go on your phone

```bash
npm install --legacy-peer-deps
npx expo start
```

To update the SDK:

```bash
npm install expo@{version number}
npx expo install --check
npx expo start
```

To update the SDK:

```bash
npm install expo@{version number}
npx expo install --check
npx expo start
```

## Client server communication setup

1. Copy `.env.example` to `.env`
2. Find your IP address:
   - Windows: Run `ipconfig` and use IPv4 Address under "Wireless LAN adapter Wi-Fi" and append `:8000`
   - Mac/Linux: Run `ifconfig` or `ip addr`
3. Update `EXPO_PUBLIC_API_URL` in `.env` with your IP

**Here's an example: `EXPO_PUBLIC_API_URL=http://192.168.13.1:8000`**

If you are running the server on the Digital Ocean Droplet, the above instructions stand, but the IP address should be that of the droplet: `134.199.188.243`

## Linting and Formatting Scripts

This project uses ESLint and Prettier to maintain code quality and consistency. Below are the scripts defined in the `package.json` for linting and formatting:

- **`lint`**: Runs ESLint on all JavaScript, JSX, TypeScript, and TSX files in the project to identify and report on patterns found in the code.
   ```sh
   npm run lint
   ```

- **`lint:fix`**: Runs ESLint with the `--fix` option to automatically fix problems where possible.
   ```sh
   npm run lint:fix
   ```

- **`prettier`**: Checks the code formatting using Prettier.
   ```sh
   npm run prettier
   ```

- **`prettier:fix`**: Formats the code using Prettier.
   ```sh
   npm run prettier:fix
   ```

- **`format`**: Runs both `lint:fix` and `prettier:fix` scripts to automatically fix linting issues and format the code.
   ```sh
   npm run format
   ```