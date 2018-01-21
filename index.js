const Search = props =>
  React.DOM.input({
    type: 'input',
    onChange: props.onChange,
  })

const Thumbnail = props =>
  React.DOM.img({
    className: 'image',
    src: props.src,
  })

const ListRow = props =>
  React.DOM.tr({key: `${props.person.firstName} ${props.person.lastName}`}, [
    React.DOM.td(
      {key: 'thumb'},
      React.createElement(Thumbnail, {src: getImageUrl(props.person)})
    ),
    React.DOM.td({key: 'first'}, null, getFirstName(props.person)),
    React.DOM.td({key: 'last'}, null, getLastName(props.person)),
  ])

const ListContainer = props =>
  React.DOM.table({className: 'list-container'}, [
    React.DOM.thead(
      {key: 'thead'},
      React.DOM.tr({}, [
        React.DOM.th({key: 'thumb-h'}, null, 'Thumbnail'),
        React.DOM.th({key: 'first-h'}, null, 'First Name'),
        React.DOM.th({key: 'last-h'}, null, 'Last Name'),
      ])
    ),
    React.DOM.tbody(
      {key: 'tbody'},
      props.personList.map((person, i) =>
        React.createElement(ListRow, {key: `person-${i}`, person})
      )
    ),
  ])

const App = React.createClass({
  getInitialState() {
    return {
      personList: [],
      visiblePersonList: [],
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
    this.setState({
      visiblePersonList: sortByFirstName(this.state.personList),
    })
  },

  _sortByLast() {
    this.setState({
      visiblePersonList: sortByLastName(this.state.personList),
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
        personList: visiblePersonList,
      }),
    ])
  },
})

ReactDOM.render(React.createElement(App), document.getElementById('app'))
