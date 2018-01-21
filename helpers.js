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

const getLastName = ({lastName}) => lastName

const getFirstName = ({firstName}) => firstName

// headshot URLs are scheme relative //
// prepend http: to prevent invalid schemes like file:// or uri://
const placeHolderUrl =
  '//images.contentful.com/3cttzl4i3k1h/5ZUiD3uOByWWuaSQsayAQ6/c630e7f851d5adb1876c118dc4811aed/featured-image-TEST1.png'

const getImageUrl = ({lastName, headshot}) => {
  const url = headshot.url || placeHolderUrl

  // The h query string sets a maximum height of the image
  // this standardizes image sizes and reduces file size
  return `http:${url}?h=250`
}

/**
 * Fisher-Yates shuffle
 */
function shuffleList(list) {
  // Make a copy & don't mutate the passed in list
  const result = list.slice(0)

  let tmp
  let j
  let i = list.length - 1

  for (; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    tmp = list[i]
    list[i] = list[j]
    list[j] = tmp
  }

  return result
}

const getCompareStrings = baseString => {
  const baseStringLower = baseString.trim().toLowerCase()

  return (...comparisons) => {
    for (let i = 0; i < comparisons.length; i++) {
      const compareString = comparisons[i].trim().toLowerCase()
      if (compareString.includes(baseStringLower)) {
        return true
      }
    }

    return false
  }
}

/**
 * Remove any people that do not have the name we are
 * searching for.
 */
const filterByName = (searchForName, personList) => {
  const searchName = searchForName.trim()
  if (!searchName) return personList

  const compareStrings = getCompareStrings(searchForName)

  return personList.filter(({firstName, lastName}) =>
    compareStrings(firstName, lastName)
  )
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
const sortObjListByProp = prop => {
  return function(objList) {
    // Make a copy & don't mutate the passed in list
    const result = objList.slice(0)

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
