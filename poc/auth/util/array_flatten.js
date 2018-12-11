/**
 * Flatten an array of arbitrarily nested arrays. For example,
 * 
 * [[1,2,[3]],4] -> [1,2,3,4]
 * 
 * It will flatten nested arrays containing not only integer data, but any data.
 * 
 * Caveat: It does operate recursively, so make sure the nested array fits 
 * within the capabilities of your stack.
 * 
 * @param theArray response object.
 *
 * @return an array containing the data without nested arrays.
 */
flattenArray = (theArray) => {
	let result = [];
	theArray.forEach(element => {
		if (Array.isArray(element)) {
			try {
				result = result.concat(flattenArray(element));
			} catch (err) {
				return err; // stack overflow
			}
		} else {
			result.push(element);
		}
	});
	return result;
}

console.log(`Integer array: ${flattenArray([[1,2,[3]],4])}`); //Integer array: 1,2,3,4
console.log(`String array: ${flattenArray([["one","two",["three"]],"four"])}`); //String array: one,two,three,four
console.log(`Mixed data array: ${flattenArray([["one",2,[{"three":3}]],true])}`); //Mixed data array: one,2,[object Object],true