import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Button, Table } from 'antd'
import axios from 'axios'
import NextEpoch from '../../../components/NextEpoch/EpochTimeCoutdown'
import getPoolAddress from '../../../utils/pool'
import { TSD, TSDS, UNI, USDC } from '../../../constants/tokens'
import {
  getCouponPremium,
  getPoolTotalClaimable,
  getPoolTotalRewarded,
  getTokenBalance,
  getTokenTotalSupply,
  getTotalBonded,
  getTotalCoupons,
  getTotalDebt,
  getTotalRedeemable,
  getTotalStaged,
  getBalanceBonded,
  getBalanceOfStaged,
  getFluidUntil,
  getLockedUntil,
  getStatusOf,
  getTokenAllowance,
  getEpoch,
  getEpochTime,
  getPool,
  getAllRegulations,
  getTotalSupplyUni,
  getToken0,
  getPoolTotalBonded,
  getPoolTotalStaged,
} from '../../../utils/infura'

class DashboardBNB extends Component {
  constructor(props) {
    super(props)
    this.state = {
      Epoch: [],
      EpochTime: [],
      TotalSupply: [],
      TotalBonded: [],
      TotalStaged: [],
      TotalRedeemable: [],
      TotalDebt: [],
      TotalCoupons: [],
      TSDUNIPair: [],
      USDCUNIPair: [],
      poolLiquidityStr: [],
      Pool: [],
      AllRegulations: [],
      TotalSupplyUni: [],
      Token0: [],
      PoolTotalBonded: [],
      PoolTotalStaged: [],
    }
  }

  componentDidMount = async () => {
    const poolAddressStr = await getPoolAddress()

    Promise.all([
      getEpoch(TSDS.addr),
      getEpochTime(TSDS.addr),
      getTokenTotalSupply(TSD.addr),
      getTotalBonded(TSDS.addr),
      getTotalStaged(TSDS.addr),
      getTotalRedeemable(TSDS.addr),
      getTotalDebt(TSDS.addr),
      getTotalCoupons(TSDS.addr),
      getTokenBalance(TSD.addr, UNI.addr),
      getTokenBalance(USDC.addr, UNI.addr),
      getPool(TSDS.addr),
      getAllRegulations(TSDS.addr),
      getTotalSupplyUni(UNI.addr),
      getToken0(UNI.addr),
      getPoolTotalBonded(poolAddressStr),
      getPoolTotalStaged(poolAddressStr),
    ]).then(value => {
      const Epoch = value[0]
      const EpochTime = value[1]
      const TotalSupply = value[2]
      const TotalBonded = value[3]
      const TotalStaged = value[4]
      const TotalRedeemable = value[5]
      const TotalDebt = value[6]
      const TotalCoupons = value[7]
      const TSDUNIPair = value[8]
      const USDCUNIPair = value[9]
      const Pool = value[10]
      const AllRegulations = value[11]
      const TotalSupplyUni = value[12]
      const Token0 = value[13]
      const PoolTotalBonded = value[14]
      const PoolTotalStaged = value[15]
      // console.log('value', value)
      this.setState({
        Epoch,
        EpochTime,
        TotalSupply,
        TotalBonded,
        TotalStaged,
        TotalRedeemable,
        TotalDebt,
        TotalCoupons,
        TSDUNIPair,
        USDCUNIPair,
        Pool,
        AllRegulations,
        TotalSupplyUni,
        Token0,
        PoolTotalBonded,
        PoolTotalStaged,
      })
    })
  }

  render() {
    return (
      <div>
        <Helmet title="Dashboard: Analytics BNB" />
        <div className="cui__utils__heading">
          <strong>Comming Soon</strong>
        </div>
      </div>
    )
  }
}

export default DashboardBNB
