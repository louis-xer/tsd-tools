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

class TokenInfo extends Component {
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
    const DaoTotalSupply =
      Number(this.state.TotalBonded) +
      Number(this.state.TotalStaged) +
      Number(this.state.TotalRedeemable)

    const TotalSupply = (this.state.TotalSupply / 1e18).toFixed(3)
    const TotalBonded = (this.state.TotalBonded / 1e18).toFixed(3)
    const TotalStaged = (this.state.TotalStaged / 1e18).toFixed(3)
    const TSDUNIPair = (this.state.TSDUNIPair / 1e18).toFixed(3)
    const USDCUNIPair = (this.state.USDCUNIPair / 1e6).toFixed(3)

    const Token0 = this.state.Token0

    const Price = this.state.USDCUNIPair / this.state.TSDUNIPair
    const MarketCap = (Price * this.state.TotalSupply) / 1e6

    const SpotPrice = (USDCUNIPair / TSDUNIPair).toFixed(3)

    const TSDLpBonded = Number(this.state.TSDUNIPair) * 2
    const DAO2 =
      ((((Number(this.state.TotalSupply) * 4) / 100) * 60) / 100 + Number(this.state.TotalBonded)) /
      Number(this.state.TotalBonded)
    const LPHourly =
      Number((((Number(this.state.TotalSupply) * 4) / 100) * 40) / 100 + Number(TSDLpBonded)) /
      Number(TSDLpBonded)
    const LPDaily =
      (((((Number(this.state.TotalSupply) * 4) / 100) * 40) / 100) * 24 + Number(TSDLpBonded)) /
      Number(TSDLpBonded)
    const Epoch = Number(this.state.EpochTime) + 1

    const TotalSupply2 = Number(this.state.TotalSupply)

    const getLpWeekly =
      (((((Number(TotalSupply2) * 4) / 100) * 40) / 100) * 168 + Number(TSDLpBonded)) /
      Number(TSDLpBonded)

    return (
      <div>
        <Helmet title="Dashboard: Analytics" />
        <div className="cui__utils__heading">
          <strong>Token Informations (TSD)</strong>
        </div>
        <div className="cui__utils__heading">
          <strong>Etherscan: </strong>
          <a
            href="https://etherscan.io/address/0x4846239FDF4D4C1AEB26729fa064B0205acA90e1"
            target="_blank"
          >
            {' '}
            {Token0}
          </a>
        </div>

        <div className="row">
          <div className="col-xl-4">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div>
                  <p>
                    <strong>Dextools: </strong>
                    <a
                      href="https://www.dextools.io/app/uniswap/pair-explorer/0x55b0c2eee5d48af6d2a65507319d20453e9f97b6"
                      target="_blank"
                    >
                      0x55b0c2eee5d48af6d2a65507319d20453e9f97b6
                    </a>
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Website: </strong>
                    <a href="https://truedollar.finance/" target="_blank">
                      https://truedollar.finance/
                    </a>
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Telegram: </strong>
                    <a href="https://t.me/TrueSeigniorageDollar" target="_blank">
                      https://t.me/TrueSeigniorageDollar
                    </a>
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Twitter: </strong>
                    <a href="https://twitter.com/TrueSeigniorage" target="_blank">
                      https://twitter.com/TrueSeigniorage
                    </a>
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Github: </strong>
                    <a href="https://github.com/TrueDollar" target="_blank">
                      https://github.com/TrueDollar
                    </a>
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Medium: </strong>
                    <a href="https://trueseigniorage.medium.com/" target="_blank">
                      https://trueseigniorage.medium.com/
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div>
                  <p>
                    <strong>Advance incentive:</strong> 25 TSD
                  </p>
                </div>
                <div>
                  <p>
                    <strong>DAO Lockup:</strong> 72 Epochs
                  </p>
                </div>
                <div>
                  <p>
                    <strong>LP Lockup:</strong> 24 Epochs
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Source:</strong> Uniswap USDC/TSD pair
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Method:</strong>{' '}
                    <a href="https://uniswap.org/docs/v2/core-concepts/oracles/" target="_blank">
                      Uniswap V2 Time Weighted Average Price (TWAP)
                    </a>
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Oracle Minimum:</strong> 10,000 USDC
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4">
            <div className="card">
              <div className="card-body">
                <div className="cui__utils__heading">
                  <strong>Yield Farming Info</strong>
                </div>
                <div>
                  <p>
                    <strong>LP hourly:</strong> {((LPHourly - 1) * 100).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p>
                    <strong>LP daily:</strong> {((LPDaily - 1) * 100).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p>
                    <strong>DAO hourly:</strong> {((DAO2 - 1) * 100).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p>
                    <strong>DAO daily:</strong> {((DAO2 - 1) * 24 * 100).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Epoch Length:</strong> 3,600 Seconds (1 Hour)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-6">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">
                  {MarketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })} $
                </div>
                <div className="text-uppercase">Market Cap</div>
              </div>
            </div>
          </div>

          <div className="col-xl-4">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">
                  {Number(TotalSupply).toLocaleString(undefined, { maximumFractionDigits: 0 })} TSD
                </div>
                <div className="text-uppercase">Total Supply</div>
              </div>
            </div>
          </div>

          <div className="col-xl-2">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">
                  {SpotPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })} USDC
                </div>
                <div className="text-uppercase">Spot Price</div>
              </div>
            </div>
          </div>
        </div>

        <div className="cui__utils__heading">
          <strong>Binance (Comming Soon)</strong>
        </div>
      </div>
    )
  }
}

export default TokenInfo
