document.addEventListener("DOMContentLoaded", function(){
    AppController.displayWelcome()
})

class AppController {
	
	static displayWelcome() {
        
		const wrapper = document.getElementsByClassName('wrapper')[0]
		
		const x = document.createElement('input')
		x.type = "text"
		x.id = "x"
		x.name = "x"

		const plus = document.createElement('p')
		plus.id = "plus"
		plus.innerText = "+"
		
				
		const y = document.createElement('input')
		y.type = "text"
		y.id = "y"
		y.name = "y"
		wrapper.appendChild(x)
		wrapper.appendChild(plus)
		wrapper.appendChild(y)

		
		
		const button = document.createElement('button')
		button.id = 'button'
		button.innerText = 'equals'		
		wrapper.appendChild(button)
		
		const result = document.createElement('div')
		result.innerText = "no result yet"
		result.id = 'result'
		result.classList.add('result')
		
		wrapper.appendChild(result)

		button.addEventListener('click', function(e){
			const a = document.getElementById('x').value
			const b = document.getElementById('y').value 
			const sum = AddBigNumbers.add(a, b)
			AppController.updateResult(sum)
		})
        
    }
	
	
	
	static updateResult(z) {
		let result = document.getElementById('result') 
		AddBigNumbers.wordForm(z)
		result.innerText = AddBigNumbers.formatStringNumber(z)
		result.innerText += "\n" + AddBigNumbers.wordForm(z)
	}
	
}

class AddBigNumbers {
	// accepts two string inputs
	// checks input to ensure all numbers no letters or special chars
	// returns the sum in string form 
	static add(a, b) {	
		// arrayAdd is a helper function that adds each array element and accounts for carried values (9+9 = 18)		
		function arrayAdd(a, b, c, count) {
			if (count == 0) {
				c[count] = a[count] + b[count]
			} else {
				if (!!a[count] == false) {
					a[count] = 0
				}
				if (!!b[count] == false) {
					b[count] = 0
				}
				
				if (c[count-1] > 9) {
					c[count] = a[count] + b[count] + Number(c[count-1].toString().split("")[0])
					c[count-1] = Number(c[count-1].toString().split("")[1])			
				} else {
					c[count] = a[count] + b[count]
				}
			}	
			return c 
		}
		// strip preceding zeros (e.g. 0005 + 004 => 5 + 4)
		// if input blank input = 0
		// strip non numerical string values 
		// returns a string of numbers 
		function cleanseInput(a) {
			if (!a) {
				a = "0"
			}
			
			// if input contains non-numerical values
			if (/[^\d.-]/.test(a) == true) {
				return "0"
			}			

			// if input is all zeros return 0 
			a = a.split("")			
			if (a.every(x => x == "0")) {
				return "0"
			}

			//strip preceeding zeros 
			let counter = 0;
			let leadingZero = true;
			let zeros = 0;

			while (counter < a.length  && leadingZero == true) {
				if (a[counter] == "0") {
					zeros ++
				} else {
					leadingZero = false; 
				}
				counter ++ 
			}
			return a.slice(zeros).join("")
		}
		
		let aArray = cleanseInput(a).split("").map(x => Number(x)).reverse()
		let bArray = cleanseInput(b).split("").map(x => Number(x)).reverse()
		let cArray = []

		let counter = 0
		while (counter < aArray.length || counter < bArray.length) {
			cArray = arrayAdd(aArray, bArray, cArray, counter)
			counter++
		}
		return cArray.reverse().join("")
	}
	
	static formatStringNumber(string) {
		// returns a string with commas added every 3 numbers 
		let counter = 0
		return string.split("").reverse().map(x => {
			if (counter % 3 === 0 && counter != 0) {
				counter = 1
				return x + ","			
			} else {
				counter++
				return x 
			}
		}).reverse().join("")
	}
	
	static wordForm(string) {
		// accepts a string without commas 
		// outputs the number in words   #=> 123 one hundred twenty three 
		
		if (string.length == 0) {
			return "zero"
		}
			
		let reverse = string.split("").reverse()	
		
		// break reverse array into blocks of 3 , send them to pattern() then concat suffix (<none>, thousand, million, etc. ) 	

			// if pattern returns 000 do not concat suffix   (1,000,001) is not one million zero thousand one, it is one million one - no concat thousand if all 000
		function shouldAddSuffix (array) {
			// returns true or false
			// if all zeros do not add suffix 
			// array is an array of single digit strings length 3 
			return !array.every(x => x === "0")
		}

		//solutionkey will return a the function to test whether or not the lower groups are all 000s
		//this will reduce repetition below 
		
		const solutionKey = {		
			"thousands": (revArray) => {
				if (shouldAddSuffix(revArray.slice(3,6)) == true) {
					return pattern(revArray.slice(3,6)) + " thousand \n" + pattern(revArray.slice(0,3))  
				} else {
					return pattern(revArray.slice(0,3))  
				}				
			},
			"millions": (revArray) => {				
				if (shouldAddSuffix(revArray.slice(6,9)) == true) {
					return pattern(revArray.slice(6,9)) + " million \n"
				} else {
					return ""
				}							
			},
			"billions": (revArray) => {
				if (shouldAddSuffix(revArray.slice(9,12)) == true) {
					return pattern(revArray.slice(9,12)) + " billion \n"
				} else {
					return ""
				}
			},
			"trillions": (revArray) => {
				if (shouldAddSuffix(revArray.slice(12,15)) == true) {
					return pattern(revArray.slice(12,15)) + " trillion \n"
				} else {
					return ""
				}
			},
			"quadrillions": (revArray) => {
				if (shouldAddSuffix(revArray.slice(15,18)) == true) {
					return pattern(revArray.slice(15,18)) + " quadrillion \n"
				} else {
					return ""
				}
			}
		}

		if (reverse.length < 4) {
			return pattern(reverse)			
		}	else if (reverse.length < 7) {
			return pattern(reverse.slice(3,6)) + " thousand " + 
			pattern(reverse.slice(0,3))
		}	else if (reverse.length < 10) {
			return pattern(reverse.slice(6,9)) + " million \n" + 
			solutionKey["thousands"](reverse)	
		}	else if (reverse.length < 13) {
			return pattern(reverse.slice(9,12)) + " billion \n" + 
			solutionKey["millions"](reverse) + 
			solutionKey["thousands"](reverse)			
		}	else if (reverse.length < 16) {
			return pattern(reverse.slice(12,15)) + " trillion \n" + 
			solutionKey["billions"](reverse) + 
			solutionKey["millions"](reverse) + 
			solutionKey["thousands"](reverse)
		}	else if (reverse.length < 19) {
			return pattern(reverse.slice(15,18)) + " quadrillion \n" + 
			solutionKey["trillions"](reverse) +
			solutionKey["billions"](reverse) + 
			solutionKey["millions"](reverse) + 
			solutionKey["thousands"](reverse)
		}	else if (reverse.length < 22) {
			return pattern(reverse.slice(18,21)) + " quintillion \n" +
			solutionKey["quadrillions"](reverse) +
			solutionKey["trillions"](reverse) +
			solutionKey["billions"](reverse) + 
			solutionKey["millions"](reverse) + 
			solutionKey["thousands"](reverse)
		}	else {
			return "too big" 
		}
		
		// pattern accepts an array of 3 string numbers and returns the word form of those 3 numbers #=> 333 -> three hundred thirty-three 
		// this is the pattern of increasing numbers in word form. with this we can concat the suffix if applicable (thousand, million, billion, etc. ) (see above  ) 
		function pattern (reverse) {
	
			const onesKey = {
				"0": "",
				"1": "one",
				"2": "two",
				"3": "three",
				"4": "four",
				"5": "five",
				"6": "six",
				"7": "seven",
				"8": "eight",
				"9": "nine"
			}
			const teensKey = {
				"10": "ten",
				"11": "eleven",
				"12": "twelve",
				"13": "thirteen",
				"14": "fourteen",
				"15": "fifteen",
				"16": "sixteen",
				"17": "seventeen",
				"18": "eighteen",
				"19": "nineteen"
			}
			const tensKey = {
				"0": "",
				"2": "twenty",
				"3": "thirty",
				"4": "forty",
				"5": "fifty",
				"6": "sixty",
				"7": "seventy",
				"8": "eighty",
				"9": "ninety"
			}
		
			// reverse is an array length 3 each element containing a one digit string representation of single digit number
			let shortSol = ""
			
			switch(reverse.length) {
			  case 1:
				shortSol += onesKey[reverse[0]]
				break;
			  case 2:
				if (reverse[1] == "1") {
					// account for ten elven twelve teens 
					shortSol += teensKey[reverse[1]+reverse[0]]
				} else {
					if (reverse[0] != "0") {
						shortSol += tensKey[reverse[1]] + "-" + onesKey[reverse[0]]
					} else {
						shortSol += tensKey[reverse[1]]
					}				
				}
				break;
			  case 3: 
				if (reverse[1] == "1") {
					// account for ten elven twelve teens 
					shortSol += onesKey[reverse[2]] + " hundred " + teensKey[reverse[1]+reverse[0]]
				} else {
					const z1 = reverse[0] == "0"
					const z2 = reverse[1] == "0"
					const z3 = reverse[2] == "0"
					const array = [z1, z2, z3]		

					if (arrayEquals(array, [false, false, false])) {
						shortSol += onesKey[reverse[2]] + " hundred " + tensKey[reverse[1]] + "-" + onesKey[reverse[0]]
					}	else if (arrayEquals(array, [false, false, true])) {
						shortSol += tensKey[reverse[1]] + "-" + onesKey[reverse[0]]
					}	else if (arrayEquals(array, [false, true, true])) {
						shortSol += onesKey[reverse[0]]
					}	else if (arrayEquals(array,[true, true, true])) {
						shortSol += ""
					}	else if (arrayEquals(array, [true, true, false])) {
						shortSol += onesKey[reverse[2]] + " hundred "
					}   else if (arrayEquals(array, [true, false, false])) {
						shortSol += onesKey[reverse[2]] + " hundred " + tensKey[reverse[1]]
					}	else if (arrayEquals(array, [false, true, false])) {
						shortSol += onesKey[reverse[2]] + " hundred " + onesKey[reverse[0]]
					}	else if (arrayEquals(array, [true, false, true])) {
						shortSol += tensKey[reverse[1]]
					}	else {
						shortSol += "???" // failed to account for some combination of 0 and non zero digits in the three digit array 
					}
				}
				break;
			  default:
			  console.log("pattern default") // lenght not equal 1, 2, or 3
				break;
			} 
			return shortSol; 
			
		}
		
		// array equals is a helper function used in wordForm to evaluate which elements contain 0 in an array length 3 
		function arrayEquals(a, b) {
		  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, index) => val === b[index]);
		}
	
	}
	
	
}

//    Test.assertEquals(add('63829983432984289347293874', '90938498237058927340892374089'), "91002328220491911630239667963")
