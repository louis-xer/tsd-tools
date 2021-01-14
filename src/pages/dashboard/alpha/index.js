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

const tableColumns = [
  {
    title: 'Epoch',
    dataIndex: 'epoch',
    key: 'epoch',
  },
  {
    title: 'Bonded',
    dataIndex: 'newBonded',
    key: 'newBonded',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
  },
  {
    title: 'Debt',
    dataIndex: 'newDebt',
    key: 'newDebt',
  },
  {
    title: 'Redeemable',
    dataIndex: 'newRedeemable',
    key: 'newRedeemable',
  },
]

class DashboardAlpha extends Component {
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

    const TotalSupply = (this.state.TotalSupply / 1000000000000000000).toFixed(3)
    const TotalBonded = (this.state.TotalBonded / 1000000000000000000).toFixed(3)
    const TotalStaged = (this.state.TotalStaged / 1000000000000000000).toFixed(3)
    const TSDUNIPair = (this.state.TSDUNIPair / 1000000000000000000).toFixed(3)
    const USDCUNIPair = (this.state.USDCUNIPair / 1000000).toFixed(3)
    const TotalRedeemable = this.state.TotalRedeemable

    const Token0 = this.state.Token0
    const TotalSupplyUni = (this.state.TotalSupplyUni / 1000000000000000000).toFixed(6)

    const DAO = (Number(DaoTotalSupply * 100) / Number(TotalSupply) / 1000000000000000000).toFixed(
      2,
    )
    const Bonded = (
      Number(TotalBonded * 100) / Number(DaoTotalSupply / 1000000000000000000)
    ).toFixed(2)
    const Staged = (
      Number(TotalStaged * 100) / Number(DaoTotalSupply / 1000000000000000000)
    ).toFixed(2)
    const Redeemable = Number(TotalRedeemable * 100) / Number(DaoTotalSupply / 1000000000000000000)

    const increaseBy = ((Number(this.state.TotalSupply) / 1000000000000000000) * 4) / 100
    const daoBonding =
      ((((Number(this.state.TotalSupply) / 1000000000000000000) * 4) / 100) * 60) / 100
    const lpBonding =
      ((((Number(this.state.TotalSupply) / 1000000000000000000) * 4) / 100) * 40) / 100

    const SpotPrice = (USDCUNIPair / TSDUNIPair).toFixed(3)
    const LPStaged = (
      (Number(this.state.PoolTotalStaged) / Number(this.state.TotalSupply)) *
      100000000
    ).toFixed(2)
    const LPBonded = (
      (Number(this.state.PoolTotalBonded) / Number(this.state.TotalSupply)) *
      100000000
    ).toFixed(2)

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

    const data = this.state.AllRegulations.map((d, i) => {
      d.data.newBonded
        ? (d.data.newBonded = (
            Number(d.data.newBonded) / 1000000000000000000
          ).toLocaleString(undefined, { maximumFractionDigits: 2 }))
        : (d.data.newBonded = 0)
      d.data.newDebt
        ? (d.data.newDebt = (Number(d.data.newDebt) / 1000000000000000000).toLocaleString(
            undefined,
            { maximumFractionDigits: 2 },
          ))
        : (d.data.newDebt = 0)
      d.data.price = (Number(d.data.price) / 1000000000000000000).toLocaleString(undefined, {
        maximumFractionDigits: 3,
      })
      d.data.newRedeemable
        ? (d.data.newRedeemable = (
            Number(d.data.newRedeemable) / 1000000000000000000
          ).toLocaleString(undefined, { maximumFractionDigits: 3 }))
        : (d.data.newRedeemable = 0)
      return { ...d.data, id: i }
    })

    console.log('Data', data)

    const Price = this.state.USDCUNIPair / this.state.TSDUNIPair
    const MarketCap = (Price * this.state.TotalSupply) / 1000000

    const TotalSupply2 = Number(this.state.TotalSupply)

    const getLpWeekly =
      (((((Number(TotalSupply2) * 4) / 100) * 40) / 100) * 168 + Number(TSDLpBonded)) /
      Number(TSDLpBonded)
    const LpWeekly = ((Number(getLpWeekly) - 1) * 100).toFixed(2)
    const DaoWeekly = ((DAO2 - 1) * 168 * 100).toFixed(2)

    return (
      <div>
        <Helmet title="Dashboard: Analytics" />
        <div className="cui__utils__heading">
          <strong>Statistics True Seigniorage Dollar (TSD)</strong>
        </div>
        <div className="row">
          <div className="col-xl-3">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">
                  <NextEpoch /> - {Epoch}
                </div>
                <div className="text-uppercase">Next Epoch</div>
                <div></div>
              </div>
            </div>
          </div>

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

          <div className="col-xl-3">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">
                  {SpotPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })} USDC
                </div>
                <div className="text-uppercase">Spot Price</div>
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

          <div className="col-xl-4">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">
                  {Number(TotalBonded).toLocaleString(undefined, { maximumFractionDigits: 0 })} TSD
                </div>
                <div className="text-uppercase">Total Bonded</div>
              </div>
            </div>
          </div>

          <div className="col-xl-4">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">
                  {Number(TotalStaged).toLocaleString(undefined, { maximumFractionDigits: 0 })} TSD
                </div>
                <div className="text-uppercase">Total Staged</div>
              </div>
            </div>
          </div>

          <div className="col-xl-6">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">
                  {Number(TSDUNIPair).toLocaleString(undefined, { maximumFractionDigits: 0 })} TSD
                </div>
                <div className="text-uppercase">TSD - UNI Pair</div>
              </div>
            </div>
          </div>

          <div className="col-xl-6">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">
                  {Number(USDCUNIPair).toLocaleString(undefined, { maximumFractionDigits: 0 })} USDC
                </div>
                <div className="text-uppercase">USDC - UNI Pair</div>
              </div>
            </div>
          </div>

          <div className="col-xl-3">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">
                  +{' '}
                  {Number(SpotPrice) < 1
                    ? '0'
                    : increaseBy.toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
                  TSD
                </div>
                <div className="text-uppercase">$TSD Supply will increase </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">
                  +{' '}
                  {Number(SpotPrice) < 1
                    ? '0'
                    : daoBonding.toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
                  TSD
                </div>
                <div className="text-uppercase">$TSD for DAO Bonding</div>
              </div>
            </div>
          </div>
          <div className="col-xl-3">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">
                  {' '}
                  +{' '}
                  {Number(SpotPrice) < 1
                    ? '0'
                    : lpBonding.toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
                  TSD
                </div>
                <div className="text-uppercase">$TSD for LP Bonding</div>
              </div>
            </div>
          </div>

          <div className="col-xl-3">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">1:00 Hour</div>
                <div className="text-uppercase">Period: 1 Epoch</div>
              </div>
            </div>
          </div>

          <div className="col-xl-4">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">
                  {(Number(this.state.TotalCoupons) / 1e18).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-uppercase">Coupons</div>
              </div>
            </div>
          </div>

          <div className="col-xl-4">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">
                  {(Number(this.state.TotalDebt) / 1e18).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{' '}
                  (35.00%)
                </div>
                <div className="text-uppercase">Debt</div>
              </div>
            </div>
          </div>

          <div className="col-xl-4">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">
                  {(Number(this.state.TotalRedeemable) / 1e18).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-uppercase">Redeemable</div>
              </div>
            </div>
          </div>

          <div className="col-xl-3">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">
                  {Number(SpotPrice) < 1 ? '0' : ((LPHourly - 1) * 100).toFixed(2)}% (
                  {((LPHourly - 1) * 100).toFixed(2)}%)
                </div>
                <div className="text-uppercase">LP hourly</div>
              </div>
            </div>
          </div>

          <div className="col-xl-3">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">
                  {Number(SpotPrice) < 1 ? '0' : ((LPDaily - 1) * 100).toFixed(2)}% (
                  {((LPDaily - 1) * 100).toFixed(2)}%)
                </div>
                <div className="text-uppercase">LP daily</div>
              </div>
            </div>
          </div>

          <div className="col-xl-3">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">
                  {Number(SpotPrice) < 1 ? '0' : ((DAO2 - 1) * 100).toFixed(2)}% (
                  {((DAO2 - 1) * 100).toFixed(2)}%)
                </div>
                <div className="text-uppercase">DAO hourly</div>
              </div>
            </div>
          </div>

          <div className="col-xl-3">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">
                  {Number(SpotPrice) < 1 ? '0' : ((DAO2 - 1) * 24 * 100).toFixed(2)}% (
                  {((DAO2 - 1) * 24 * 100).toFixed(2)}%)
                </div>
                <div className="text-uppercase">DAO daily</div>
              </div>
            </div>
          </div>

          <div className="col-xl-6">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">
                  {Number(SpotPrice) < 1 ? '0' : LpWeekly}% ({LpWeekly}%)
                </div>
                <div className="text-uppercase">LP Weekly</div>
              </div>
            </div>
          </div>

          <div className="col-xl-6">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="font-size-30 font-weight-bold text-dark mb-n2">
                  {Number(SpotPrice) < 1 ? '0' : DaoWeekly}% ({DaoWeekly}%)
                </div>
                <div className="text-uppercase">DAO Weekly</div>
              </div>
            </div>
          </div>
        </div>
        <div className="cui__utils__heading">
          <strong>TSD Information</strong>
        </div>

        <div className="row">
          <div className="col-xl-6">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div className="cui__utils__heading">
                  <strong>Token Information</strong>
                </div>
                <div>
                  <p>
                    <strong>Token True Seigniorage Dollar: </strong>
                    <a
                      href="https://etherscan.io/address/0x4846239FDF4D4C1AEB26729fa064B0205acA90e1"
                      target="_blank"
                    >
                      {Token0}
                    </a>
                  </p>
                </div>
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
          <div className="col-xl-3">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div>
                  <p>
                    <strong>Epoch Length:</strong> 3,600 Seconds (1 Hour)
                  </p>{' '}
                </div>
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
                <div>
                  <p>
                    <strong>Period:</strong> 1 Epoch (1 Hour)
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3">
            <div className="card">
              <div className="card-body overflow-hidden position-relative">
                <div>
                  <p>
                    <strong>Total Supply:</strong>{' '}
                    {Number(TotalSupply).toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
                    TSD
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Total Bonded: </strong>
                    {Number(TotalBonded).toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}{' '}
                    TSD
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Total Staged:</strong>{' '}
                    {Number(TotalStaged).toLocaleString(undefined, { maximumFractionDigits: 0 })}{' '}
                    TSD
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Spot Price:</strong>{' '}
                    {Number(SpotPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })} USDC
                  </p>
                </div>
                <div>
                  <p>
                    <strong>TSD - UNI Pair:</strong>{' '}
                    {Number(TSDUNIPair).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>USDC - UNI Pair:</strong>{' '}
                    {Number(USDCUNIPair).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Total Redeemable:</strong> {this.state.TotalRedeemable}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Total Debt:</strong>{' '}
                    {(Number(this.state.TotalDebt) / 1e18).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Total Coupons:</strong>{' '}
                    {(Number(this.state.TotalCoupons) / 1e18).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-3">
            <div className="card">
              <div className="card-body">
                <div className="cui__utils__heading">
                  <strong>Yield Farming Info</strong>
                </div>
                <div>
                  <p>
                    <strong>LP hourly:</strong>{' '}
                    {Number(SpotPrice) < 1 ? '0' : ((LPHourly - 1) * 100).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p>
                    <strong>LP daily:</strong>{' '}
                    {Number(SpotPrice) < 1 ? '0' : ((LPDaily - 1) * 100).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p>
                    <strong>DAO hourly:</strong>{' '}
                    {Number(SpotPrice) < 1 ? '0' : ((DAO2 - 1) * 100).toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p>
                    <strong>DAO daily:</strong>{' '}
                    {Number(SpotPrice) < 1 ? '0' : ((DAO2 ** 24 - 1) * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="card-header">
                <div className="cui__utils__heading mb-0">
                  <strong>All Regulations</strong>
                </div>
                <div className="text-muted">History</div>
              </div>
              <div className="card-body">
                <Table columns={tableColumns} dataSource={data} pagination={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default DashboardAlpha
