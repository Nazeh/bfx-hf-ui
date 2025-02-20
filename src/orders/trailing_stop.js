import { isValidDate } from '../util/date'

export default () => ({
  label: 'Trailing Stop',
  uiIcon: 'trailing-stop-active',
  customHelp: 'Trailing stop orders follow (\'trail\') the market price up (for sell orders) or down (for buy orders) by the specified trailing distance. If the market price moves against the trailing stop order, it does not move and will execute once the market reaches the order.\n\nIf the \'reduce-only\' option is specified, the order will be cancelled if it would open or increase the size of an open position.\n\nA Time-In-Force date may be specified, after which the order will be automatically cancelled.',

  generateOrder: (data = {}, symbol, context) => {
    const {
      reduceonly, tif, tifDate, distance, amount, lev,
    } = data

    if (tif && (!isValidDate(tifDate) || tifDate === 0)) {
      throw new Error('TIF date required')
    }

    const orderDefinition = {
      type: context === 'm' || context === 'f' ? 'TRAILING STOP' : 'EXCHANGE TRAILING STOP',
      priceTrailing: distance,
      amount,
      symbol,
      reduceonly,
    }

    if (tif) {
      orderDefinition.tif = new Date(+tifDate).toISOString()
    }

    if (context === 'f') {
      orderDefinition.lev = lev
    }

    return orderDefinition
  },

  header: {
    component: 'ui.checkbox_group',
    fields: ['reduceonly', 'tif'],
  },

  sections: [{
    title: '',
    name: 'general',
    rows: [
      ['distance', 'amount'],
    ],
  }, {
    title: '',
    name: 'tif',
    fullWidth: true,
    rows: [
      ['tifDate'],
    ],

    visible: {
      tif: { eq: true },
    },
  }, {
    title: '',
    name: 'lev',
    fullWidth: true,
    rows: [
      ['lev'],
    ],

    visible: {
      _context: { eq: 'f' },
    },
  }],

  fields: {
    reduceonly: {
      component: 'input.checkbox',
      label: 'REDUCE-ONLY',
      trading: ['m'],
      default: false,
    },

    tif: {
      component: 'input.checkbox',
      label: 'TIF',
      default: false,
    },

    distance: {
      component: 'input.price',
      label: 'Distance $QUOTE',
    },

    amount: {
      component: 'input.amount',
      label: 'Amount $BASE',
    },

    tifDate: {
      component: 'input.date',
      label: 'TIF Date',
      default: new Date(Date.now() + 86400000),
      minDate: new Date(),
    },

    lev: {
      component: 'input.range',
      label: 'Leverage',
      min: 1,
      max: 100,
      default: 10,
    },
  },

  actions: ['buy', 'sell'],
})
