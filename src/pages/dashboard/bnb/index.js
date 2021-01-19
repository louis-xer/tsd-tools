import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { Button, Table } from 'antd'
import NextEpoch from '../../../components/NextEpoch-2/EpochTimeCoutdown'
import getPoolAddress from '../../../utils-2/pool'
import { TSD, TSDS, UNI, BUSD } from '../../../constants-bsc/tokens'
import {
  getCouponPremium,
  getPoolTotalClaimable,
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
} from '../../../utils-2/infura'

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
      BUSDUNIPair: [],
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
      getTokenBalance(BUSD.addr, UNI.addr),
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
      const BUSDUNIPair = value[9]
      const Pool = value[10]
      const AllRegulations = value[11]
      const TotalSupplyUni = value[12]
      const Token0 = value[13]
      const PoolTotalBonded = value[14]
      const PoolTotalStaged = value[15]
      console.log('value', value)
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
        BUSDUNIPair,
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
    const BUSDUNIPair = (this.state.BUSDUNIPair / 1e18).toFixed(3)
    const TotalRedeemable = this.state.TotalRedeemable

    const Token0 = this.state.Token0
    const TotalSupplyUni = (this.state.TotalSupplyUni / 1e18).toFixed(6)

    const DAO = (Number(DaoTotalSupply * 100) / Number(TotalSupply) / 1e18).toFixed(2)
    const Bonded = (Number(TotalBonded * 100) / Number(DaoTotalSupply / 1e18)).toFixed(2)
    const Staged = (Number(TotalStaged * 100) / Number(DaoTotalSupply / 1e18)).toFixed(2)
    const Redeemable = Number(TotalRedeemable * 100) / Number(DaoTotalSupply / 1e18)

    const increaseBy = ((Number(this.state.TotalSupply) / 1e18) * 4) / 100
    const daoBonding = ((((Number(this.state.TotalSupply) / 1e18) * 4) / 100) * 60) / 100
    const lpBonding = ((((Number(this.state.TotalSupply) / 1e18) * 4) / 100) * 40) / 100

    const SpotPrice = Number(BUSDUNIPair / TSDUNIPair).toFixed(3)
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
        ? (d.data.newBonded = (Number(d.data.newBonded) / 1e18).toLocaleString(undefined, {
            maximumFractionDigits: 2,
          }))
        : (d.data.newBonded = 0)
      d.data.newDebt
        ? (d.data.newDebt = (Number(d.data.newDebt) / 1e18).toLocaleString(undefined, {
            maximumFractionDigits: 2,
          }))
        : (d.data.newDebt = 0)
      d.data.price = (Number(d.data.price) / 1e18).toLocaleString(undefined, {
        maximumFractionDigits: 3,
      })
      d.data.newRedeemable
        ? (d.data.newRedeemable = (Number(d.data.newRedeemable) / 1e18).toLocaleString(undefined, {
            maximumFractionDigits: 3,
          }))
        : (d.data.newRedeemable = 0)
      return { ...d.data, id: i }
    })

    console.log('Data', data)

    const Price = this.state.BUSDUNIPair / this.state.TSDUNIPair
    const MarketCap = Number(Price * this.state.TotalSupply) / 1e18

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
                  {SpotPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })} BUSD
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
                  {Number(BUSDUNIPair).toLocaleString(undefined, { maximumFractionDigits: 0 })} BUSD
                </div>
                <div className="text-uppercase">BUSD - UNI Pair</div>
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
