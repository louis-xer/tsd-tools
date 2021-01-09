import axios from 'axios'

const TotalSupply =
  'https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0x4846239fdf4d4c1aeb26729fa064b0205aca90e1&apikey=MN126VZ8YJI2AMRIT61V5WETK7CWCEW384'
const ReadContract =
  'https://api.etherscan.io/api?module=contract&action=getabi&address=0xA5BE4aE152D77682B466A9F00b0Cb0dD1432820B&apikey=MN126VZ8YJI2AMRIT61V5WETK7CWCEW384'

function getTotalSupply() {
  return axios.get(TotalSupply)
}

function getContractABI() {
  return axios.get(ReadContract)
}

export { getTotalSupply, getContractABI }
