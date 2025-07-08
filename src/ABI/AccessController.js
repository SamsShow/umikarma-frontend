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
				"name": "ruleId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "reason",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "AccessDenied",
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
				"name": "accessLevel",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ruleId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "AccessGranted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ruleId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "minKarma",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "minTrustFactor",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "requiresVerification",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "minContributions",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "accessLevel",
				"type": "uint256"
			}
		],
		"name": "AccessRuleAdded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "daoAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "daoName",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "accessLevel",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "DaoIntegrationAdded",
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
		"inputs": [],
		"name": "ACCESS_LEVEL_BASIC",
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
		"name": "ACCESS_LEVEL_CONTRIBUTOR",
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
		"name": "ACCESS_LEVEL_ELITE",
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
		"name": "ACCESS_LEVEL_TRUSTED",
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "accessRules",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "ruleId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "minKarma",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "minTrustFactor",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "requiresVerification",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "minContributions",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "accessLevel",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "minKarma",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "minTrustFactor",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "requiresVerification",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "minContributions",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "accessLevel",
				"type": "uint256"
			}
		],
		"name": "addAccessRule",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "daoAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "daoName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "requiredAccessLevel",
				"type": "uint256"
			},
			{
				"internalType": "uint256[]",
				"name": "customRules",
				"type": "uint256[]"
			}
		],
		"name": "addDaoIntegration",
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
			},
			{
				"internalType": "uint256",
				"name": "ruleId",
				"type": "uint256"
			}
		],
		"name": "checkAccess",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "daoAddress",
				"type": "address"
			}
		],
		"name": "checkDaoAccess",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "daoIntegrations",
		"outputs": [
			{
				"internalType": "address",
				"name": "daoAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "daoName",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "requiredAccessLevel",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "active",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "ruleId",
				"type": "uint256"
			}
		],
		"name": "getAccessRule",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "ruleId",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "minKarma",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "minTrustFactor",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "requiresVerification",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "minContributions",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "accessLevel",
						"type": "uint256"
					},
					{
						"internalType": "bool",
						"name": "active",
						"type": "bool"
					}
				],
				"internalType": "struct AccessController.AccessRule",
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
				"name": "daoAddress",
				"type": "address"
			}
		],
		"name": "getDaoIntegration",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "daoAddress",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "daoName",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "requiredAccessLevel",
						"type": "uint256"
					},
					{
						"internalType": "uint256[]",
						"name": "customRules",
						"type": "uint256[]"
					},
					{
						"internalType": "bool",
						"name": "active",
						"type": "bool"
					}
				],
				"internalType": "struct AccessController.DaoIntegration",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalRules",
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
		"name": "getUserPermissions",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "userAddress",
						"type": "address"
					},
					{
						"internalType": "uint256[]",
						"name": "grantedLevels",
						"type": "uint256[]"
					},
					{
						"internalType": "uint256",
						"name": "lastChecked",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "accessCount",
						"type": "uint256"
					}
				],
				"internalType": "struct AccessController.UserPermissions",
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
				"name": "userAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "ruleId",
				"type": "uint256"
			}
		],
		"name": "grantAccess",
		"outputs": [],
		"stateMutability": "nonpayable",
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
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userPermissions",
		"outputs": [
			{
				"internalType": "address",
				"name": "userAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "lastChecked",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "accessCount",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]