const Search = ({onChange}) =>
  React.DOM.input({
    type: 'input',
    onChange,
  })

const Thumbnail = ({src}) =>
  React.DOM.img({
    className: 'image',
    src,
  })

const ListRow = ({person}) =>
  React.DOM.tr({key: `${person.firstName} ${person.lastName}`}, [
    React.DOM.td(
      {key: 'thumb'},
      React.createElement(Thumbnail, {src: getImageUrl(person)})
    ),
    React.DOM.td({key: 'first'}, null, getFirstName(person)),
    React.DOM.td({key: 'last'}, null, getLastName(person)),
  ])

const getArrow = (sortCategory, name) => {
  if (sortCategory === `${name}Name`) {
    return '↓'
  }

  if (sortCategory === `${name}NameReverse`) {
    return '↑'
  }

  return ''
}

const ListContainer = ({personList, sortCategory}) =>
  React.DOM.table({className: 'list-container'}, [
    React.DOM.thead(
      {key: 'thead'},
      React.DOM.tr({}, [
        React.DOM.th({key: 'thumb-h'}, null, 'Thumbnail'),
        React.DOM.th(
          {key: 'first-h'},
          null,
          `First Name ${getArrow(sortCategory, 'first')}`
        ),
        React.DOM.th(
          {key: 'last-h'},
          null,
          `Last Name ${getArrow(sortCategory, 'last')}`
        ),
      ])
    ),
    React.DOM.tbody(
      {key: 'tbody'},
      personList.map((person, i) =>
        React.createElement(ListRow, {key: `person-${i}`, person})
      )
    ),
  ])

const App = React.createClass({
  getInitialState() {
    return {
      personList: [],
      visiblePersonList: [],
      sortCategory: '',
    }
  },

  componentDidMount() {
    getPersonList().then(personList =>
      this.setState({
        personList,
        visiblePersonList: personList,
      })
    )
  },

  _shuffleList() {
    this.setState({
      visiblePersonList: shuffleList(this.state.personList),
    })
  },

  _sortByFirst() {
    if (this.state.sortCategory === 'firstName') {
      return this.setState({
        visiblePersonList: sortByFirstNameReverse(this.state.personList),
        sortCategory: 'firstNameReverse',
      })
    }
    this.setState({
      visiblePersonList: sortByFirstName(this.state.personList),
      sortCategory: 'firstName',
    })
  },

  _sortByLast() {
    if (this.state.sortCategory === 'lastName') {
      return this.setState({
        visiblePersonList: sortByLastNameReverse(this.state.personList),
        sortCategory: 'lastNameReverse',
      })
    }
    this.setState({
      visiblePersonList: sortByLastName(this.state.personList),
      sortCategory: 'lastName',
    })
  },

  _onSearch(e) {
    this.setState({
      visiblePersonList: filterByName(e.target.value, this.state.personList),
    })
  },

  render() {
    const {visiblePersonList} = this.state

    return React.DOM.div({className: 'app-container'}, [
      React.createElement(Search, {key: 'search', onChange: this._onSearch}),
      React.DOM.button(
        {key: 'shuffle', onClick: this._shuffleList},
        null,
        'Shuffle'
      ),
      React.DOM.button(
        {key: 'sort-first', onClick: this._sortByFirst},
        null,
        'Sort (First Name)'
      ),
      React.DOM.button(
        {key: 'sort-last', onClick: this._sortByLast},
        null,
        'Sort (Last Name)'
      ),
      React.createElement(ListContainer, {
        key: 'list',
        sortCategory: this.state.sortCategory,
        personList: visiblePersonList,
      }),
    ])
  },
})

ReactDOM.render(React.createElement(App), document.getElementById('app'))
