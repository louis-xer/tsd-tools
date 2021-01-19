import React, { Component } from 'react'
import { getBalanceBonded, getTokenBalance } from '../../../utils-2/infura'
import { TSD, UNI, BUSD, TSDS } from '../../../constants-bsc/tokens'
import Web3 from 'web3'
import { Button, Table } from 'antd'
import { Helmet } from 'react-helmet'

const ethers = require('ethers')

const UNI_ABI = [
  { inputs: [], payable: false, stateMutability: 'nonpayable', type: 'constructor' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount0', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amount1', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
    ],
    name: 'Burn',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount0', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amount1', type: 'uint256' },
    ],
    name: 'Mint',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'sender', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount0In', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amount1In', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amount0Out', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'amount1Out', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
    ],
    name: 'Swap',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint112', name: 'reserve0', type: 'uint112' },
      { indexed: false, internalType: 'uint112', name: 'reserve1', type: 'uint112' },
    ],
    name: 'Sync',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    constant: true,
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'MINIMUM_LIQUIDITY',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'PERMIT_TYPEHASH',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { internalType: 'address', name: '', type: 'address' },
      { internalType: 'address', name: '', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
    name: 'burn',
    outputs: [
      { internalType: 'uint256', name: 'amount0', type: 'uint256' },
      { internalType: 'uint256', name: 'amount1', type: 'uint256' },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'factory',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'getReserves',
    outputs: [
      { internalType: 'uint112', name: '_reserve0', type: 'uint112' },
      { internalType: 'uint112', name: '_reserve1', type: 'uint112' },
      { internalType: 'uint32', name: '_blockTimestampLast', type: 'uint32' },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: '_token0', type: 'address' },
      { internalType: 'address', name: '_token1', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'kLast',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
    name: 'mint',
    outputs: [{ internalType: 'uint256', name: 'liquidity', type: 'uint256' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'nonces',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
      { internalType: 'uint256', name: 'deadline', type: 'uint256' },
      { internalType: 'uint8', name: 'v', type: 'uint8' },
      { internalType: 'bytes32', name: 'r', type: 'bytes32' },
      { internalType: 'bytes32', name: 's', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'price0CumulativeLast',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'price1CumulativeLast',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
    name: 'skim',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { internalType: 'uint256', name: 'amount0Out', type: 'uint256' },
      { internalType: 'uint256', name: 'amount1Out', type: 'uint256' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'swap',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [],
    name: 'sync',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'token0',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'token1',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { internalType: 'address', name: 'from', type: 'address' },
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
const NODE_URL = 'https://bsc-dataseed.binance.org/'

const Contracts = {
  DAO: {
    address: '0xfc022cda7250240916abaa935a4c589a1f150fdd',
    abi: [
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'uint256', name: 'epoch', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'block', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' },
        ],
        name: 'Advance',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'account', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'start', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'valueUnderlying', type: 'uint256' },
        ],
        name: 'Bond',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'account', type: 'address' },
          { indexed: true, internalType: 'address', name: 'candidate', type: 'address' },
        ],
        name: 'Commit',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'owner', type: 'address' },
          { indexed: true, internalType: 'address', name: 'spender', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'CouponApproval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'account', type: 'address' },
          { indexed: true, internalType: 'uint256', name: 'epoch', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'couponAmount', type: 'uint256' },
        ],
        name: 'CouponBurn',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'uint256', name: 'epoch', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'couponsExpired', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'lessRedeemable', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'lessDebt', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'newBonded', type: 'uint256' },
        ],
        name: 'CouponExpiration',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'account', type: 'address' },
          { indexed: true, internalType: 'uint256', name: 'epoch', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'dollarAmount', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'couponAmount', type: 'uint256' },
        ],
        name: 'CouponPurchase',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'account', type: 'address' },
          { indexed: true, internalType: 'uint256', name: 'epoch', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'couponAmount', type: 'uint256' },
        ],
        name: 'CouponRedemption',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'from', type: 'address' },
          { indexed: true, internalType: 'address', name: 'to', type: 'address' },
          { indexed: true, internalType: 'uint256', name: 'epoch', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'CouponTransfer',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'account', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'Deposit',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'account', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'Incentivization',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'candidate', type: 'address' },
          { indexed: true, internalType: 'address', name: 'account', type: 'address' },
          { indexed: true, internalType: 'uint256', name: 'start', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'period', type: 'uint256' },
        ],
        name: 'Proposal',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'uint256', name: 'epoch', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'price', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'newDebt', type: 'uint256' },
        ],
        name: 'SupplyDecrease',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'uint256', name: 'epoch', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'price', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'newRedeemable', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'lessDebt', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'newBonded', type: 'uint256' },
        ],
        name: 'SupplyIncrease',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [{ indexed: true, internalType: 'uint256', name: 'epoch', type: 'uint256' }],
        name: 'SupplyNeutral',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'from', type: 'address' },
          { indexed: true, internalType: 'address', name: 'to', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'account', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'start', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'valueUnderlying', type: 'uint256' },
        ],
        name: 'Unbond',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'implementation', type: 'address' },
        ],
        name: 'Upgraded',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'account', type: 'address' },
          { indexed: true, internalType: 'address', name: 'candidate', type: 'address' },
          { indexed: false, internalType: 'enum Candidate.Vote', name: 'vote', type: 'uint8' },
          { indexed: false, internalType: 'uint256', name: 'bonded', type: 'uint256' },
        ],
        name: 'Vote',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'account', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'Withdraw',
        type: 'event',
      },
      {
        constant: false,
        inputs: [],
        name: 'advance',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          { internalType: 'address', name: 'owner', type: 'address' },
          { internalType: 'address', name: 'spender', type: 'address' },
        ],
        name: 'allowance',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          { internalType: 'address', name: 'owner', type: 'address' },
          { internalType: 'address', name: 'spender', type: 'address' },
        ],
        name: 'allowanceCoupons',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { internalType: 'address', name: 'spender', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'approve',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { internalType: 'address', name: 'spender', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'approveCoupons',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'address', name: 'candidate', type: 'address' }],
        name: 'approveFor',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'balanceOfBonded',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          { internalType: 'address', name: 'account', type: 'address' },
          { internalType: 'uint256', name: 'epoch', type: 'uint256' },
        ],
        name: 'balanceOfCoupons',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'balanceOfStaged',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'value', type: 'uint256' }],
        name: 'bond',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'uint256', name: 'epoch', type: 'uint256' }],
        name: 'bootstrappingAt',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ internalType: 'address', name: 'candidate', type: 'address' }],
        name: 'commit',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
        name: 'couponPremium',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          { internalType: 'uint256', name: 'couponEpoch', type: 'uint256' },
          { internalType: 'uint256', name: 'couponAmount', type: 'uint256' },
        ],
        name: 'couponRedemptionPenalty',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'uint256', name: 'epoch', type: 'uint256' }],
        name: 'couponsExpiration',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'value', type: 'uint256' }],
        name: 'deposit',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'dollar',
        outputs: [{ internalType: 'contract IDollar', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ internalType: 'address', name: 'candidate', type: 'address' }],
        name: 'emergencyCommit',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'epoch',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'epochTime',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'uint256', name: 'epoch', type: 'uint256' }],
        name: 'expiringCoupons',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          { internalType: 'uint256', name: 'epoch', type: 'uint256' },
          { internalType: 'uint256', name: 'i', type: 'uint256' },
        ],
        name: 'expiringCouponsAtIndex',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'fluidUntil',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'implementation',
        outputs: [{ internalType: 'address', name: 'impl', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [],
        name: 'initialize',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'address', name: 'candidate', type: 'address' }],
        name: 'isInitialized',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'address', name: 'candidate', type: 'address' }],
        name: 'isNominated',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'lockedUntil',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'oracle',
        outputs: [{ internalType: 'contract IOracle', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'uint256', name: 'epoch', type: 'uint256' }],
        name: 'outstandingCoupons',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'address', name: 'candidate', type: 'address' }],
        name: 'periodFor',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'pool',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'dollarAmount', type: 'uint256' }],
        name: 'purchaseCoupons',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          { internalType: 'address', name: 'account', type: 'address' },
          { internalType: 'address', name: 'candidate', type: 'address' },
        ],
        name: 'recordedVote',
        outputs: [{ internalType: 'enum Candidate.Vote', name: '', type: 'uint8' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { internalType: 'uint256', name: 'couponEpoch', type: 'uint256' },
          { internalType: 'uint256', name: 'couponAmount', type: 'uint256' },
          { internalType: 'uint256', name: 'minOutput', type: 'uint256' },
        ],
        name: 'redeemCoupons',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { internalType: 'uint256', name: 'couponEpoch', type: 'uint256' },
          { internalType: 'uint256', name: 'couponAmount', type: 'uint256' },
        ],
        name: 'redeemCoupons',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'address', name: 'candidate', type: 'address' }],
        name: 'rejectFor',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'address', name: 'candidate', type: 'address' }],
        name: 'startFor',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'statusOf',
        outputs: [{ internalType: 'enum Account.Status', name: '', type: 'uint8' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'totalBonded',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'uint256', name: 'epoch', type: 'uint256' }],
        name: 'totalBondedAt',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'totalCoupons',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'totalDebt',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'totalNet',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'totalRedeemable',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'totalStaged',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'transfer',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { internalType: 'address', name: 'sender', type: 'address' },
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'uint256', name: 'epoch', type: 'uint256' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'transferCoupons',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { internalType: 'address', name: 'sender', type: 'address' },
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'uint256', name: 'amount', type: 'uint256' },
        ],
        name: 'transferFrom',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'value', type: 'uint256' }],
        name: 'unbond',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'value', type: 'uint256' }],
        name: 'unbondUnderlying',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { internalType: 'address', name: 'candidate', type: 'address' },
          { internalType: 'enum Candidate.Vote', name: 'vote', type: 'uint8' },
        ],
        name: 'vote',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'address', name: 'candidate', type: 'address' }],
        name: 'votesFor',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'value', type: 'uint256' }],
        name: 'withdraw',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
  },
  Dollar: {
    address: '0x3E257e45B7e2265ffD450292787D95757f324964',
    ticker: 'TSD',
  },
  Oracle: {
    address: '0x69d781341e69b132d1fd03d47dcd39df1d7b8f21',
  },
  UniswapLP: {
    address: '0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F',
  },
  LPIncentivizationPool: {
    address: '0x3e257e45b7e2265ffd450292787d95757f324964',
    ticker: 'TSD-BUSD LP',
    abi: [
      {
        inputs: [
          { internalType: 'address', name: 'dollar', type: 'address' },
          { internalType: 'address', name: 'univ2', type: 'address' },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'account', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'start', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'Bond',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'account', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'Claim',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'account', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'Deposit',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'account', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'lessBusd', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'newUniv2', type: 'uint256' },
        ],
        name: 'Provide',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'account', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'start', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
          { indexed: false, internalType: 'uint256', name: 'newClaimable', type: 'uint256' },
        ],
        name: 'Unbond',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          { indexed: true, internalType: 'address', name: 'account', type: 'address' },
          { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'Withdraw',
        type: 'event',
      },
      {
        constant: true,
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'balanceOfBonded',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'balanceOfClaimable',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'balanceOfPhantom',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'balanceOfRewarded',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'balanceOfStaged',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'value', type: 'uint256' }],
        name: 'bond',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'busd',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'value', type: 'uint256' }],
        name: 'claim',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'dao',
        outputs: [{ internalType: 'contract IDAO', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'value', type: 'uint256' }],
        name: 'deposit',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'dollar',
        outputs: [{ internalType: 'contract IDollar', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [],
        name: 'emergencyPause',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { internalType: 'address', name: 'token', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        name: 'emergencyWithdraw',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'paused',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'value', type: 'uint256' }],
        name: 'provide',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
        name: 'statusOf',
        outputs: [{ internalType: 'enum PoolAccount.Status', name: '', type: 'uint8' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'totalBonded',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'totalClaimable',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'totalPhantom',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'totalRewarded',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'totalStaged',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'value', type: 'uint256' }],
        name: 'unbond',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'univ2',
        outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ internalType: 'uint256', name: 'value', type: 'uint256' }],
        name: 'withdraw',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
  },
  Parameters: {
    BootstrappingPeriod: 288,
    BootstrappingPrice: 1.44,
    EpochPeriod: 900,
    DaoLockupPeriods: 72,
    PoolLockupPeriods: 24,
    PoolRatio: 0.4,
    DaoRatio: 0.6,
    SupplyChangeLimit: 0.04,
    SupplyChangeDivisor: 10,
    GrowCutoff: 1.0,
  },
}

const tableColumns1 = [
  {
    title: 'Epoch',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Data',
    dataIndex: 'data',
    key: 'data',
  },
]

const tableColumns2 = [
  {
    title: 'Epoch',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Data',
    dataIndex: 'data',
    key: 'data',
  },
]

export default class load extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Account: [],
      BalanceBonded: [],
      TokenBalanceTSD: [],
      TokenBalanceBUSD: [],
      TokenBalanceUNI: [],
      CurrentPriceAndTimestamp: [],
      lastUnbond: [],
      lastBond: [],
      fluidEpoch: [],
      Price0: [],
      Price1: [],
      blockTimes: [],
      getoldPrice0: [],
      getoldTimestamp: [],
      twap: [],
      BalanceBonded: [],
      data1: [],
      data2: [],
    }
  }

  componentDidMount = async () => {
    window.web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'))
    let addresses = await window.web3.eth.getAccounts()
    if (!addresses.length) {
      try {
        addresses = await window.ethereum.enable()
      } catch (e) {
        console.log(e)
        return false
      }
    }
    const Account = addresses[0].toLowerCase()
    this.setState({
      Account,
    })

    Promise.all([
      getTokenBalance(TSD.addr, Account),
      getTokenBalance(UNI.addr, Account),
      getTokenBalance(BUSD.addr, Account),
      getBalanceBonded(TSDS.addr, Account),
    ]).then(value => {
      const TokenBalanceTSD = (Number(value[0]) / 1e18).toFixed(2)
      const TokenBalanceUNI = (Number(value[1]) / 1e18).toFixed(6)
      const TokenBalanceBUSD = (Number(value[2]) / 1e6).toFixed(2)
      const BalanceBonded = (Number(value[3]) / 1e18).toFixed(2)
      this.setState({
        TokenBalanceTSD,
        TokenBalanceUNI,
        TokenBalanceBUSD,
        BalanceBonded,
      })
    })

    const provider = new ethers.providers.JsonRpcProvider(NODE_URL)
    const UNI2 = new ethers.Contract(UNI.addr, UNI_ABI, provider)
    const price00 = await UNI2.price0CumulativeLast()
    const price11 = await UNI2.price1CumulativeLast()
    const { _blockTimestampLast } = await UNI2.getReserves()
    const CurrentPriceAndTimestamp = `${price00.toString()} ${price11.toString()} ${_blockTimestampLast}\n`
    const Price0 = price00.toString()
    const Price1 = price11.toString()
    const blockTimes = _blockTimestampLast
    this.setState({
      CurrentPriceAndTimestamp,
      Price0,
      Price1,
      blockTimes,
    })

    const DAO = new ethers.Contract(Contracts.DAO.address, Contracts.DAO.abi, provider)
    const LP = new ethers.Contract(
      Contracts.LPIncentivizationPool.address,
      Contracts.LPIncentivizationPool.abi,
      provider,
    )

    const unbondFilter = DAO.filters.Unbond(provider.YOUR_ADDRESS)
    const unbond = await DAO.queryFilter(unbondFilter)
    const bondFilter = DAO.filters.Bond(provider.YOUR_ADDRESS)
    const bonds = await DAO.queryFilter(bondFilter)
    if (unbond.length + bonds.length > 0) {
      const lastUnbond = Math.max(...unbond.map(u => u.args.start / 1))
      const lastBond = Math.max(...bonds.map(d => d.args.start / 1))
      const fluidEpoch = Math.max(lastUnbond, lastBond)
      this.setState({
        lastUnbond,
        lastBond,
        fluidEpoch,
      })
    }

    const epoch = Number(this.state.fluidEpoch)
    const fluidEpochs = 72
    const fluidBlocks = Number((Number(fluidEpochs * 3600) / 13.5) * 1.1) //10% leeway
    const blockNumber = await provider.getBlockNumber()
    const NumberFillter = Number(blockNumber) - Number(fluidBlocks)
    const unbonds = await DAO.queryFilter(
      DAO.filters.Unbond(),
      parseInt(NumberFillter),
      Number(blockNumber),
    )

    let data1 = []
    for (let i = 0; i < fluidEpochs; i++) {
      let filtered = unbonds.filter(u => epoch + i + 1 - fluidEpochs == u.args?.start / 1)
      let unbonding = filtered.map(u => u.args?.valueUnderlying / 1e18).reduce((x, y) => x + y, 0)
      let getData = `Unbonding at epoch ${epoch + i}: ${unbonding.toLocaleString(undefined, {
        maximumFractionDigits: 2,
      })}`
      data1 = [
        ...data1,
        {
          id: epoch + i,
          data: getData,
        },
      ]
    }
    this.setState({
      data1,
    })

    let data2 = []
    const unbondsLP = await LP.queryFilter(
      LP.filters.Unbond(),
      parseInt(NumberFillter),
      Number(blockNumber),
    )
    const fluidEpochsLP = 24
    for (let i = 0; i < fluidEpochsLP; i++) {
      let filtered = unbondsLP.filter(u => epoch + i + 1 - fluidEpochsLP == u.args?.start / 1)
      let unbonding = filtered.map(u => u.args?.value / 1e18).reduce((x, y) => x + y, 0)
      let claimable = filtered.map(u => u.args?.newClaimable / 1e18).reduce((x, y) => x + y, 0)
      let getData = `Unbonding at epoch ${epoch + i}: ${unbonding.toFixed(
        8,
      )} - Claimable: ${claimable.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
      data2 = [
        ...data2,
        {
          id: epoch + i,
          data: getData,
        },
      ]
    }
    this.setState({
      data2,
    })
  }

  render() {
    return (
      <div>
        <Helmet title="Dashboard: Yeild Farming Info" />
        <div className="cui__utils__heading">
          <strong>Hello {this.state.Account} </strong>
        </div>
        <div className="row">
          <div className="col-xl-3">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">
                  {Number(this.state.TokenBalanceTSD) / 1e18}
                </div>
                <div className="text-uppercase">Token Balance TSD</div>
                <div></div>
              </div>
            </div>
          </div>

          <div className="col-xl-3">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">
                  {this.state.TokenBalanceUNI}
                </div>
                <div className="text-uppercase">Token Balance UNI</div>
                <div></div>
              </div>
            </div>
          </div>

          <div className="col-xl-3">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">
                  {Number(this.state.TokenBalanceBUSD) / 1e12}
                </div>
                <div className="text-uppercase">Token Balance BUSD</div>
                <div></div>
              </div>
            </div>
          </div>

          <div className="col-xl-3">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">
                  {this.state.BalanceBonded}
                </div>
                <div className="text-uppercase">Balance Bonded</div>
                <div></div>
              </div>
            </div>
          </div>

          {/* <div className="col-xl-3">
                <div className="card">
                <div className="card-body overflow-hidden position-relative">
                    <div className="font-size-30 font-weight-bold text-dark mb-n2">
                    {Number(this.state.twap).toFixed(2)}
                    </div>
                    <div className="text-uppercase">TWAP</div>
                    <div></div>
                </div>
                </div>
            </div> */}
        </div>
        <div className="row">
          <div className="col-xl-6">
            <div className="card">
              <div className="card-header">
                <div className="cui__utils__heading mb-0">
                  <strong>DAO Unbonds</strong>
                </div>
                <div className="text-muted">In the future</div>
              </div>
              <div className="card-body">
                <Table columns={tableColumns1} dataSource={this.state.data1} pagination={true} />
              </div>
            </div>
          </div>

          <div className="col-xl-6">
            <div className="card">
              <div className="card-header">
                <div className="cui__utils__heading mb-0">
                  <strong>LP Unbonds</strong>
                </div>
                <div className="text-muted">In the future</div>
              </div>
              <div className="card-body">
                <Table columns={tableColumns2} dataSource={this.state.data2} pagination={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
