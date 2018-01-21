/*==================================================

  API

***************************************************/

/**
 * Get the data from the namegame endpoint.
 *
 * The data comes back in the format:
 *
 *    [
 *        { firstName: 'Viju,  lastName: 'Legard',  headshot: { url: '...' } },
 *        { firstName: 'Matt', lastName: 'Seibert', headshot: { url: '...' } },
 *        ...
 *    ]
 */
function getPersonList() {
  return new Promise((resolve, reject) => {
    fetch('https://willowtreeapps.com/api/v1.0/profiles').then(response => {
      if (response.status !== 200) {
        reject(new Error('Error!'))
      }

      response.json().then(imageList => {
        resolve(imageList)
      })
    })
  })
}

/*==================================================

  DATA TRANSFORMS

***************************************************/

function getLastName(person) {
  return person.lastName
}

const getFirstName = person => {
  return person.firstName
}

// headshot URLs are scheme relative //
// prepend http: to prevent invalid schemes like file:// or uri://
const getImageUrl = person => {
  return `http:${person.headshot.url}`
}

/**
 * Fisher-Yates shuffle
 */
function shuffleList(list) {
  // Make a copy & don't mutate the passed in list
  let result = list.slice(1)

  let tmp,
    j,
    i = list.length - 1

  for (; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    tmp = list[i]
    list[i] = list[j]
    list[j] = tmp
  }

  return result
}

/**
 * Remove any people that do not have the name we are
 * searching for.
 */
function filterByName(searchForName, personList) {
  return personList.filter(person => {
    return (
      person.firstName === searchForName || person.lastName === searchForName
    )
  })
}

/**
 * Takes in a property of an object list, e.g. "name" below
 *
 *    people = [{ name: 'Sam' }, { name: 'Jon' }, { name: 'Kevin' }]
 *
 * And returns a function that will sort that list, e.g.
 *
 *    const sortPeopleByName = sortObjListByProp('name');
 *    const sortedPeople = sortPeopleByName(people);
 *
 *  We now have:
 *
 *    console.log(sortedPeople)
 *    > [{ name: 'Jon' }, { name: 'Kevin' }, { name: 'Sam' }]
 *
 */
function sortObjListByProp(prop) {
  return function(objList) {
    // Make a copy & don't mutate the passed in list
    let result = objList.slice(1)

    result.sort((a, b) => {
      if (a[prop] < b[prop]) {
        return -1
      }

      if (a[prop] > b[prop]) {
        return 1
      }

      return 1
    })

    return result
  }
}

const sortByFirstName = sortObjListByProp('firstName')

const sortByLastName = personList => sortByFirstName(personList).reverse()
