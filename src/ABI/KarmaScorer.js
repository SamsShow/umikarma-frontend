[
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "contributionType",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "impactScore",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "ContributionAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "githubScore",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "daoScore",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "forumScore",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "identityScore",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "finalKarma",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "KarmaCalculated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "githubWeight",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "daoWeight",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "forumWeight",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "identityWeight",
				"type": "uint256"
			}
		],
		"name": "ScoringWeightsUpdated",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "CONTRIBUTION_DAO",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "CONTRIBUTION_FORUM",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "CONTRIBUTION_GITHUB",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "CONTRIBUTION_IDENTITY_VERIFICATION",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "MAX_KARMA_SCORE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "WEIGHT_SCALE",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "contributionType",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "impactScore",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "description",
				"type": "string"
			}
		],
		"name": "addContribution",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "calculateKarma",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "getUserContributionCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			}
		],
		"name": "getUserContributions",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "githubScore",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "daoScore",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "forumScore",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "identityScore",
						"type": "uint256"
					},
					{
						"components": [
							{
								"internalType": "uint256",
								"name": "contributionType",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "impactScore",
								"type": "uint256"
							},
							{
								"internalType": "uint256",
								"name": "timestamp",
								"type": "uint256"
							},
							{
								"internalType": "bool",
								"name": "verified",
								"type": "bool"
							},
							{
								"internalType": "string",
								"name": "description",
								"type": "string"
							}
						],
						"internalType": "struct KarmaScorer.ContributionRecord[]",
						"name": "contributions",
						"type": "tuple[]"
					},
					{
						"internalType": "uint256",
						"name": "lastCalculated",
						"type": "uint256"
					}
				],
				"internalType": "struct KarmaScorer.UserContributions",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "registryAddress",
				"type": "address"
			}
		],
		"name": "initialize",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "initialized",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "reputationRegistry",
		"outputs": [
			{
				"internalType": "contract ReputationRegistry",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "scoringWeights",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "githubWeight",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "daoWeight",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "forumWeight",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "identityWeight",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "githubWeight",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "daoWeight",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "forumWeight",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "identityWeight",
				"type": "uint256"
			}
		],
		"name": "updateScoringWeights",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userContributions",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "githubScore",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "daoScore",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "forumScore",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "identityScore",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastCalculated",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]