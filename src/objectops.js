/**
 * Check the list of keys are valid or not
 * @param {*} list
 * @returns true if valid key list else will throw exception
 */
function validateKeys(list) {
  if (!list || list.length === 0) {
    throw "Invalid key list. Please define a proper key list";
  } else {
    for (let i = 0; i < list.length; i++) {
      /*
          Condition that the keys shoould be string or number is not enforced as there could be other objects as keys 
         if(typeof list[i] !== 'string' || typeof list[i] !== 'number') {
           throw 'Invalid key list. All keys should be either string or number';
         } */
      if (list[i] == undefined || list[i] == null) {
        throw "Invalid key list. None of the keys can be undefined or null";
      }
    }
  }
  return true;
}

// let data = {};
function add(data, key, ...vals) {
  let keyList = [key, ...vals.slice(0, vals.length - 1)]; // generate the key list from all the params except the last one which will be the value
  let value = vals[vals.length - 1]; // last value designated as the value param

  // Invalid paramter cases will throw exceptions
  if (validateKeys(keyList) && value == undefined) {
    throw "param error value";
  } else if (keyList.length === 1) {
    // If only one key, then assign the value directly and be done with it
    data[key] = value;
    return;
  }
  let item = data[keyList[0]]; // Take the first value to the current item pointer
  let prevItem = item; // Take the first value to the previous item pointer
  if (!prevItem) {
    // If first key is undefined, then build the entire object hierarchy and set it to the data
    data[keyList[0]] = buildObjTree(keyList.slice(1, keyList.length), value); // build object tree from the second key and assign to the first key object in the base data structure
    return;
  }

  // Reached here means, at least the first key is matched and object is retrieved from the data
  // Iterate over the remaining keys through the object hierarchy
  for (let i = 1; i < keyList.length - 1; i++) {
    item = prevItem[keyList[i]]; // retrieve the next key from the previous item
    if (!item) {
      // if item not exist, then build the object hierarchy from there and assign to the data
      // FIXME: This will have to be verfied for the case of the last key only being undefined.
      prevItem[keyList[i]] = buildObjTree(
        keyList.slice(i + 1, keyList.length),
        value
      );
      return;
    }
    prevItem = item;
  }
  // The last item is assigned to the prevItem pointer.
  // FIXME: This will cause replacement of the value which is assigned to this key previously
  prevItem[keyList[keyList.length - 1]] = value;
}

function remove(data, ...keys) {
  validateKeys(keys);
  let item = data[keys[0]],
    prevItem = item;
  if (!prevItem) {
    return prevItem;
  }
  for (let i = 1; i < keys.length - 1; i++) {
    item = prevItem[keys[i]];
    if (!item) {
      return undefined;
    }
    prevItem = item;
  }
  // let lastItem = prevItem[keys[keys.length -1]];
  if (!prevItem[keys[keys.length - 1]]) {
    return undefined;
  }
  delete prevItem[keys[keys.length - 1]];
}

function modify(data, key, ...vals) {
  let keyList = [key, ...vals.slice(0, vals.length - 1)]; // generate the key list from all the params except the last one which will be the value
  let value = vals[vals.length - 1]; // last value designated as the value param

  // Invalid paramter cases will throw exceptions
  if (validateKeys(keyList) && value == undefined) {
    throw "param error value";
  }

  let item = data[keyList[0]]; // Take the first value to the current item pointer
  let prevItem = item; // Take the first value to the previous item pointer
  if (!prevItem) {
    // If first key is undefined, then build the entire object hierarchy and set it to the data
    data[keyList[0]] = buildObjTree(keyList.slice(1, keyList.length), value); // build object tree from the second key and assign to the first key object in the base data structure
    return;
  }

  // Reached here means, at least the first key is matched and object is retrieved from the data
  // Iterate over the remaining keys through the object hierarchy
  for (let i = 1; i < keyList.length - 1; i++) {
    item = prevItem[keyList[i]]; // retrieve the next key from the previous item
    if (!item) {
      // if item not exist, then build the object hierarchy from there and assign to the data
      // FIXME: This will have to be verfied for the case of the last key only being undefined.
      prevItem[keyList[i]] = buildObjTree(
        keyList.slice(i + 1, keyList.length),
        value
      );
      return;
    }
    prevItem = item;
  }
  // The last item is assigned to the prevItem pointer.
  // FIXME: This will cause replacement of the value which is assigned to this key previously
  let lastItem = prevItem[keyList[keyList.length - 1]];
  if (lastItem) {
    // Check if the last item already in the data base is a any of an Array/String/Number.
    // If that is the case a direct replace of the value will do
    if (
      Array.isArray(lastItem) ||
      typeof lastItem === "string" ||
      typeof lastItem === "number"
    ) {
      prevItem[keyList[keyList.length - 1]] = value;
    } else if (typeof lastItem === "object") {
      // if the last item is again an object, then further conditions check are needed
      // Check if the new value is an Array/String/Number.
      // If that is the case, the value cannot be merged with the current value and hence will replace the original value
      // this will cause a console warning.
      if (
        Array.isArray(value) ||
        typeof value === "string" ||
        typeof value === "number"
      ) {
        // FIXME: This console will have to be edited to aovid printing the object values
        console.warn(
          "Modify operation has caused replacement of existing object value with an Array/String/Number value. Old value has been lost.",
          lastItem,
          value
        );
        prevItem[keyList[keyList.length - 1]] = value;
      } else if (typeof value === "object") {
        // Check for extensible objects else again replacement
        if (Object.isExtensible(lastItem)) {
          // Both traget object and value are objects, hence merge both
          const newObjVal = Object.assign(value, lastItem);
          prevItem[keyList[keyList.length - 1]] = newObjVal;
        } else {
          console.warn(
            "Modify operatio has caused replacement of existing object value with another object. Old value was non extensible, and hence lost."
          );
          prevItem[keyList[keyList.length - 1]] = value;
        }
      }
    }
  }
}

function buildObjTree(keyList, value) {
  let item = {};
  let keyCount = keyList.length;
  // If there is only one key to be mapped, then create the object and return
  if (keyCount === 1) {
    item[keyList[0]] = value;
    return item;
  }
  let prevItem;
  let objRef = item;
  for (let i = 0; i < keyCount - 1; i++) {
    item[keyList[i]] = {};
    item = item[keyList[i]];
  }
  item[keyList[keyCount - 1]] = value;
  return objRef;
}

function get(data, ...keys) {
  validateKeys(keys);
  let item = data[keys[0]],
    prevItem = item;
  if (!prevItem) {
    return prevItem;
  }
  for (let i = 1; i < keys.length - 1; i++) {
    item = prevItem[keys[i]];
    if (!item) {
      return undefined;
    }
    prevItem = item;
  }
  return prevItem[keys[keys.length - 1]];
}

module.exports = {
  add,
  remove,
  modify,
  get
};
