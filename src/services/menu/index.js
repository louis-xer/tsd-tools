export default async function getMenuData() {
  return [
    {
      category: true,
      title: 'TSD Informations',
    },
    {
      title: 'Token Information',
      key: 'tokeninfo',
      icon: 'fe fe-info',
      url: '/tokeninfo',
    },
    {
      category: true,
      title: 'Etherscan',
    },
    {
      title: 'Dashboards (ETH)',
      key: 'dashboards',
      icon: 'fe fe-home',
      url: '/home',
    },
    {
      title: 'Yield Farming Info (ETH)',
      key: 'yield',
      icon: 'fe fe-dollar-sign',
      url: '/yield',
    },
    {
      category: true,
      title: 'Binance',
    },
    {
      title: 'Dashboards (BNB)',
      key: 'dashboards2',
      icon: 'fe fe-home',
      url: '/homebnb',
    },
    // {
    //   title: 'Yield Farming Info (BNB)',
    //   key: 'yieldbnb',
    //   icon: 'fe fe-dollar-sign',
    //   url: '/yieldbnb',
    // },
  ]
}
