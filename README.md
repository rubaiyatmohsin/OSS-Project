# Tea Protocol Rewards

This project integrates with the tea protocol on Sepolia testnet to enable reward distribution for open-source contributions. The project showcases how to integrate with the tea protocol and participate in the OSS ecosystem.

## Features

- Advanced Node.js project structure
- Tea protocol integration for rewards
- Contribution tracking and scoring
- Example of tea.yaml constitution

## Getting Started

1. Clone this repository
2. Install dependencies:
```bash
npm install
```
3. Run the project:
```bash
npm start
```

## Tea Protocol Integration

This project is registered on the tea protocol, which means:
- It participates in the tea ecosystem
- Contributors can earn rewards based on the project's teaRank
- The project can receive stakes from community members
- Automated reward distribution for contributions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 

## Configuration

This project uses environment variables for configuration. You can set the following variables in your environment:

- `INFURA_API_KEY`: Your Infura API key
- `TEA_TOKEN_ADDRESS`: The address of the TEA token contract
- `TEA_STAKING_ADDRESS`: The address of the staking contract
- `PROJECT_ADDRESS`: The address of your project
- `GITHUB_TOKEN`: Your GitHub token

You can set these variables in your environment by creating a `.env` file with the following content:
```
INFURA_API_KEY=your_infura_key
TEA_TOKEN_ADDRESS=tea_contract_address
TEA_STAKING_ADDRESS=staking_contract_address
PROJECT_ADDRESS=your_project_address
GITHUB_TOKEN=your_github_token 