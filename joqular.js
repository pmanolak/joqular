/*
 * GNU GENERAL PUBLIC LICENSE
 * Version 3, 29 June 2007
 * Copyright 2015 (and left) AnyWhichWay, LLC and Simon Y. Blackwell
 * 
 * The software is provided as is without any guarantee of quality or applicability for any specific use.
 * 
 * Attribution for the work of others is in the source code, although none came with a license stipulation.
 */
(function(exports) {
	"use strict";
	function toPredicate(f) {
		var predicate = function() {
			if(arguments[0] instanceof Array && f.length>1) {
				return f.apply(this,arguments[0]);
			}
			return f.apply(this,arguments);
		};
		predicate.predicate = true;
		return predicate;
	}
	function toProvider(f) {
		f.provider = true;
		return f;
	}
	function Null() {
		
	}
	(Null.prototype.eq = function(value) { return value===null || value.valueOf()===null; }).predicate = true;
	(Null.prototype.neq = function(value) { return value!==null && value.valueOf()!==null; }).predicate = true;
	(Null.prototype["in"] = function(value) {
		return value && value.contains && value.contains(this);
	}).predicate=true;
	(Null.prototype.nin = function(value) {
		return !value || !value.contains || !value.contains(this);
	}).predicate=true;
	Null.prototype.valueOf = function() { return null; }
	var NULL = new Null();
	function toObject(value) {
		if(value===undefined) {
			return undefined;
		}
		if(value===null) {
			return NULL;
		}
		if(typeof(value)==="object" || typeof(value)==="function") {
			return value;
		}
		var type = typeof(value);
		switch(type) {
		case "string": return new String(value);
		case "number": return new Number(value);
		case "boolean": return new Boolean(value);
		}
		return undefined; // should this actually throw an error?
	}
	// soundex from https://gist.github.com/shawndumas/1262659
	function soundex(s) {
	     var a = s.toLowerCase().split(''),
	         f = a.shift(),
	         r = '',
	         codes = {
	             a: '', e: '', i: '', o: '', u: '',
	             b: 1, f: 1, p: 1, v: 1,
	             c: 2, g: 2, j: 2, k: 2, q: 2, s: 2, x: 2, z: 2,
	             d: 3, t: 3,
	             l: 4,
	             m: 5, n: 5,
	             r: 6
	         };
	 
	     r = f +
	         a
	         .map(function (v, i, a) { return codes[v] })
	         .filter(function (v, i, a) {
	             return ((i === 0) ? v !== codes[f] : v !== a[i - 1]);
	         })
	         .join('');
	 
	     return (r + '000').slice(0, 4).toUpperCase();
	}
	/*
	* http://www.anujgakhar.com/2014/03/01/binary-search-in-javascript/
	* Improvements 2015 by AnyWhichWay
	*/
	function binarySearch(array, key) {
	    var lo = 0,
	        hi = array.length - 1,
	        mid,
	        element,
	        results = [];
	    while (lo <= hi) {
	        mid = ((lo + hi) >> 1);
	        element = array[mid];
	        if (element < key) {
	            lo = mid + 1;
	        } else if (element > key) {
	            hi = mid - 1;
	        } else {
	            if(array[mid]===key || (key && array[mid]===key.valueOf())) {
	            	results.push(mid);
	            	while(array[mid]===key || (key && array[mid]===key.valueOf())) {
		            	mid++;
					}
	            	results.push(mid-1);
	            }
	            return results;
	        }
	    }
	    return results;
	}
	/*
	 * https://github.com/Benvie
	 * improvements 2015 by AnyWhichWay
	 */
	function intersection(array) {
			var arrays = arguments.length;
			// fast path when we have nothing to intersect
			if (arrays === 0) {
				return [];
			}
			if (arrays === 1) {
				return array.slice();
			}
			 
			var arg   = 0, // current arg index
					bits  = 0, // bits to compare at the end
					count = 0, // unique item count
					items = [], // unique items
					match = [], // item bits
					seen  = new Map(); // item -> index map
			 
			do {
				var arr = arguments[arg],
						len = arr.length,
						bit = 1 << arg, // each array is assigned a bit
						i   = 0;
			 
				if (!len) {
					return []; // bail out if empty array
				}
			 
				bits |= bit; // add the bit to the collected bits
				do {
					var value = arr[i],
							index = seen.get(value); // find existing item index
			 
					if (index === undefined) { // new item
						count++;
						index = match.length;
						seen.set(value, index);
						items[index] = value;
						match[index] = bit;
					} else { // update existing item
						match[index] |= bit;
					}
				} while (++i < len);
			} while (++arg < arrays);
			 
				var result = [],
				i = 0;
			 
			do { // filter out items that don't have the full bitfield
				if (match[i] === bits) {
					result[result.length] = items[i];
				}
			} while (++i < count);
			 
				return result;
	}
	function getRandomInt(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	//Please cite as 
	//Shanti R Rao and Potluri M Rao, "Sample Size Calculator", 
	//Raosoft Inc., 2009, http://www.raosoft.com/samplesize.html

	//probCriticalNormal function is adapted from an algorithm published
	//in Numerical Recipes in Fortran.
	function probCriticalNormal(P)
	{
//	      input p is confidence level convert it to
//	      cumulative probability before computing critical

		var   Y, Pr,	Real1, Real2, HOLD;
		var  I;
		var PN = [0,    // ARRAY[1..5] OF REAL
				-0.322232431088  ,
				 -1.0             ,
				 -0.342242088547  ,
				 -0.0204231210245 ,
				 -0.453642210148E-4 ];

		var QN = [0,   //  ARRAY[1..5] OF REAL
				0.0993484626060 ,
				 0.588581570495  ,
				 0.531103462366  ,
				 0.103537752850  ,
				 0.38560700634E-2 ];

		 Pr = 0.5 - P/2; // one side significance


	  if ( Pr <=1.0E-8) HOLD = 6;
		else {
				if (Pr == 0.5) HOLD = 0;
				else{
						Y = Math.sqrt ( Math.log( 1.0 / (Pr * Pr) ) );
						Real1 = PN[5];  Real2 = QN[5];

						for ( I=4; I >= 1; I--)
						{
						  Real1 = Real1 * Y + PN[I];
						  Real2 = Real2 * Y + QN[I];
						}

						HOLD = Y + Real1/Real2;
				} // end of else pr = 0.5
			} // end of else Pr <= 1.0E-8

	  return HOLD;
	}  // end of CriticalNormal

	function sampleSize(confidence, margin, population)
	{
		var response = 50, pcn = probCriticalNormal(confidence / 100.0),
	     d1 = pcn * pcn * response * (100.0 - response),
	     d2 = (population - 1.0) * (margin * margin) + d1;
	    if (d2 > 0.0)
	     return Math.ceil(population * d1 / d2);
	    return 0.0;
	}
	function crossProduct(args,test) {
	  	  var end  = args.length - 1;
	  	  var result = []
	  	  function addTo(curr, start) {
	  	    var first = args[start]
	  	      , last  = (start === end)
	  	    for (var i = 0; i < first.length; ++i) {
	  	      var copy = curr.slice();
	  	      copy.push(first[i])
	  	      if (last) {
	  	    	  if(!test || test(copy,result.length)) {
	  	        	result.push(copy);
	  	    	  }
	  	      } else {
	  	        addTo(copy, start + 1)
	  	      }
	  	    }
	  	  }
	  	  if (args.length) {
	  	    addTo([], 0)
	  	  } else {
	  	    result.push([])
	  	  }
	  	  return result
	}
	function Sorter() {
	    this.sorts = [];
	}
	Sorter.prototype.by = function(path,direction) {
		this.sorts.push({path:path.split("."),direction:direction});
	}
	Sorter.prototype.sort = function(rows) {
		var me = this;
		rows.sort(function(rowa,rowb) {
			var result;
			me.sorts.some(function(spec) {
				var alias = spec.path[0];
				var valuea = rowa[alias];
				var valueb = rowb[alias];
				for(var i = 1;i < spec.path.length; i++) {
					valuea = (valuea ? valuea[spec.path[i]] : valuea);
					valueb = (valueb ? valueb[spec.path[i]] : valueb);
				}
				if(valuea===valueb) return result = 0;
				if(spec.direction==="asc") {
					if(valuea < valueb) return result = -1;
					return result = 1;
				}
				if(valuea < valueb) return result = 1;
				return result = -1;
			});
			return result;
		});
	}
	// returns null or undefined if possibleReference is either of those values
	// returns possibleReference as value if no aliases provided
	// returns dereference.ignore if possibleReference is a reference and can be skipped
	// otherwise returns an object representing the reference value, even if a primitive
	function dereference(possibleReference,aliases,scope) {
		if(possibleReference===null || possibleReference===undefined) {
			return {value: toObject(possibleReference)};
		}
		var value, type = typeof(possibleReference);
		if(type==="function") {
			if(possibleReference.deferred) {
				return dereference(possibleReference(),aliases,scope)
			}
			return {value: possibleReference};
		}
		if(type==="object") {
			var key = Object.keys(possibleReference)[0];
			if(aliases && aliases.indexOf) {
				if(aliases.indexOf(key)>=0) {
					return {value: dereference.ignore};
				}
			} else if(aliases!=null && typeof(aliases)==="object") {
				var path;
				if(aliases[key] && typeof(aliases[key])==="object") {
					path = possibleReference[key].split(".");
					value = aliases[key];
					for(var i=0;i<path.length;i++) {
						value = value[path[i]];
						if(value===undefined) {
							return {value: undefined};
						}
					}
					return {value: toObject(value)};
				}
			}
			//if(key==="@" && value1 instanceof Object) {
			//	if(value1.history instanceof History) {
			//		return value1.history.joqularMatch(value2);
			//	}
			//	return false;
			//}
			if(possibleReference) {
				var possiblepath = Object.keys(possibleReference)[0], value, test;
				if(["lt","lte","eq","neq","gte","gt"].indexOf(possiblepath)>=0 && possibleReference[possiblepath]!==undefined) {
					test = possiblepath;
					value = possibleReference[test];
					if(value instanceof Array) {
						return {test: test, value: value};
					}
					if(possibleReference[test] && typeof(possibleReference[test])!=="string") {
						possiblepath = Object.keys(possibleReference[test])[0];
					}
				}
				if(possiblepath && scope) {
					if(possiblepath.indexOf("/")===0) {
						value = scope[0];
						path = possiblepath.substring(1).split(".");
						if(path[0]==="") {
							path.shift();
						}
					} else if(possiblepath.indexOf("..")===0) {
						if(scope.length-1<0) { return false; }
						value = scope[scope.length-1];
						path = possiblepath.substring(2).split(".");
						if(path[0]==="") {
							path.shift();
						}
					} else if(possiblepath.indexOf(".")===0) {
						if(scope.length===0) { return false; }
						value = scope[scope.length-1];
						path = possiblepath.substring(1).split(".");
						if(path[0]==="") {
							path.shift();
						}
					} else if(aliases && aliases[possiblepath] && typeof(aliases[possiblepath])!=="function") {
						if(possibleReference[test]) {
							return {test: test, value: toObject(aliases[possiblepath][possibleReference[test][possiblepath]])};
						} 
					} else if(test) {
						return {test: test, value: toObject(value)};
					}
					if(value) {
						if(test) {
							path.push(possibleReference[test][possiblepath]);
						} else {
							path.push(possibleReference[possiblepath]);
						}
						for(var i=0;i<path.length && value!==undefined;i++) {
							value = value[path[i]];
						}
						return {test: test, value: toObject(value)};
					}
					return {value: toObject(possibleReference)};
				} else if(test) {
					return {test: test, value: toObject(value)};
				}
			}
			return {value: toObject(possibleReference)};
		}
		return {value: toObject(possibleReference)};
	}
	dereference.ignore = {};
	function getIntrinsicType(value) {
		if(value===undefined || value===null || value instanceof Null) {
			return "undefined";
		}
		return typeof(value.valueOf());
	}
	function providerTest(providerValue,value,test,aliases) {
		if(value==null) {
			return providerValue === value;
		}
		switch(test) {
		case "lt": return providerValue < value.valueOf();
		case "lte": return providerValue <= value.valueOf();
		case "eq": return providerValue === value.valueOf();
		case "neq": return providerValue !== value.valueOf();
		case "gte": return providerValue >= value.valueOf();
		case "gt": return providerValue > value.valueOf();
		default: return providerValue === value.valueOf();
		}
		return false;
	}
	function joqularMatch(pattern,aliases,scope) {
		scope || (scope = [this]);
		var me = this, keys, aliased = false;
		if(typeof(pattern)==="function" && pattern.deferred) {
			pattern = pattern.call(this,this.valueOf());
		}
		if(pattern===undefined || pattern.valueOf()===undefined) {
			return null;
		}
		if(pattern===me || pattern===me.valueOf() || (pattern!=null && pattern.valueOf()===me.valueOf())) {
			return me;
		}
		if(pattern!=null && getIntrinsicType(pattern)==="object") {
			keys = Object.keys(pattern);
			if(keys.length===0) {
				return me;
			}
			if(keys.every(function(key) {
				if(key==='$$') {
					return pattern.$$.call(scope[0]);
				}
				if(key==='$') {
					return pattern.$(me.valueOf());
				}
				if(key==="forall" || key==="exists") {
					return pattern[key](me);
				}
				var value1 = toObject(me[key]), type1 = getIntrinsicType(value1), value2s = [], value2;
				if(value1===undefined) {
					return false;
				}
				//if(value1!==undefined) {
					var deref = dereference(pattern[key],aliases,scope);
					value2 = deref.value;
					if(value2===dereference.ignore) {
						return true;
					}
					if(value2===undefined) {
						return false;
					}
					var type2 = getIntrinsicType(value2);
					//value2s.push(value2);
					//return value2s.every(function(value2) {
						return (!deref.test && value1===value2 || 
							(!deref.test && value1.valueOf()===value2.valueOf()) ||
							(typeof(value1[deref.test])==="function" && value1[deref.test].call(value1,value2)) ||
							(type1==="function" && value1.predicate && value1.call(me,(value2!=null ? value2.valueOf() : value2))) ||
							(type1==="function" && value1.provider && providerTest(value1.call(me),value2,deref.test,aliases)) ||
							(type1!=="function" && typeof(value1[deref.test])!=="function" && (type1!==type2 || type2==="object") && value1.joqularMatch && joqularMatch.call(value1,value2,aliases,scope.concat([me]))));
					//});
				//}
				//return false;
			})) {
				return this;
			}
			return null;
		}
		return null;
	};
	// {name: "Simon"}
	// {name: {String: "Simon", ids: {}}}
	// pattern: {name: "Simon"}
	// {name: "Simon", address: {zipcode: 98110}}
	// {name: {String: "Simon"}, address: {Object: {zipcode: {Number: 98110}}}}
	function Ids() {
		
	}
	function Key() {
		
	}
	function Kind() {
		this.joqularIdMap = new Ids();
	}
	Kind.prototype.getValues = function(kind) {
		var me = this;
		if(!me.joqularValues) {
			var values = [], keys = Object.keys(me);
			keys.forEach(function(key) {
				if(key==="Functions" || key==="joqularIdMap" || key==="joqularId" || key==="forgeinIds") {
					return;
				}
				var value;
				switch(kind) {
					case "Boolean": value = (key==="true" ? true : false); values.push(value); break;
					case "Number": value = parseFloat(key); values.push(value); break;
					case "String": value = key; values.push(value); break;
					case "Null": value = null; values.push(value); break;
					// index find will assume any other types must be testes during instance match cycle
				};
			});
			if(kind==="Number") {
				values.sort(function(a,b) { return a - b; });
			} else {
				values.sort();
			}
			me.joqularValues = values;
		}
		return me.joqularValues;
	}
	Kind.prototype.getIds = function() {
		if(!this.joqularIds) {
			Object.defineProperty(this,"joqularIds",{enumerable:false,configurable:true,writable:true,value:Object.keys(this.joqularIdMap)});
		}
		return this.joqularIds;
	}
	Kind.prototype.find = function(index,value,results,scopes,scopekey,scopekind) {
		//scopes || (scopes = []);
		var me = this, testvalue = value.valueOf(), kindname = value.constructor.name, pass = [], instancevalues, instancevalue;
		if(!me[scopekey]) {
			results.splice(0,results.length);
			return false;
		}
		if(kindname==="Function") {
			var kindnames = Object.keys(me[scopekey]);
			kindnames.forEach(function(kindname) {
				if(value===FindPattern.prototype.defined) {
					pass = pass.concat(me[scopekey][kindname].getIds());
				} else {
					instancevalues = me[scopekey][kindname].getValues(kindname);
					if(value.test==="every") {
						if(["Boolean","Number","String","Null"].indexOf(kindname)===-1) {
							pass = pass.concat(me[scopekey][kindname].getIds());
						} else {
							instancevalues.every(function(instancevalue) {
								instancevalue = new Object.joqularIndexes[kindname](instancevalue).valueOf();
								if(value(instancevalue)) {
									pass = pass.concat(me[scopekey][kindname][instancevalue].getIds());
									return true;
								}
								return false;
							});
						}
					} else if(value.test==="some") {
						if(["Boolean","Number","String","Null"].indexOf(kindname)===-1) {
							pass = pass.concat(me[scopekey][kindname].getIds());
						} else {
							instancevalues.some(function(instancevalue) {
								instancevalue = new Object.joqularIndexes[kindname](instancevalue).valueOf();
								if(value(instancevalue)) {
									pass = pass.concat(me[scopekey][kindname][instancevalue].getIds());
									return true;
								}
								return false;
							});
						}
					} else {
						if(["Boolean","Number","String","Null"].indexOf(kindname)===-1) {
							pass = pass.concat(me[scopekey][kindname].getIds());
						} else {
							instancevalues.forEach(function(instancevalue) {
								instancevalue = new Object.joqularIndexes[kindname](instancevalue).valueOf();
								if(value(instancevalue)) {
									pass = pass.concat(me[scopekey][kindname][instancevalue].getIds());
								}
							});
						}
					}
				}
			}); 
		} else if(["Boolean","Number","String","Null"].indexOf(kindname)>=0) {
			if(value.test) {
				if(!me[scopekey][kindname] && value.test==="neq") {
					var kindnames = Object.keys(me[scopekey]);
					kindnames.forEach(function(kindname) {
						pass = pass.concat(me[scopekey][kindname].getIds());
					});
				} else if(me[scopekey][kindname]) {
					instancevalues = me[scopekey][kindname].getValues(kindname);
					switch(value.test) {
						// do optimized tests against sorted values from index
						case "lt":
							for(var i=0;i<instancevalues.length;i++) {
							 	instancevalue = new value.constructor(instancevalues[i]==="false" ? false : instancevalues[i]).valueOf()
								if(instancevalue < testvalue) {
									pass = pass.concat(me[scopekey][kindname][instancevalue].getIds());
									continue;
								}
								break;
							};
							break;
						case "lte":
							for(var i=0;i<instancevalues.length;i++) {
							 	instancevalue = new value.constructor(instancevalues[i]==="false" ? false : instancevalues[i]).valueOf()
								if(instancevalue <= testvalue) {
									pass = pass.concat(me[scopekey][kindname][instancevalue].getIds());
									continue;
								}
								break;
							};
							break;
						case "eq": 
							var i = instancevalues.bsearch(testvalue)[0];
							if(i>=0) {
								pass = pass.concat(me[scopekey][kindname][testvalue].getIds());
							};
							break;
						case "neq":
							instancevalues.forEach(function(instancevalue) {
								if(instancevalue !== testvalue) {
									pass = pass.concat(me[scopekey][kindname][instancevalue].getIds());
								}
							});
							break;
						case "gte":
							for(var i=instancevalues.length-1;i>=0;i--) {
							 	instancevalue = new value.constructor(instancevalues[i]==="false" ? false : instancevalues[i]).valueOf()
								if(instancevalue >= testvalue) {
									pass = pass.concat(me[scopekey][kindname][instancevalue].getIds());
									continue;
								}
								break;
							};
							break;
						case "gt":
							for(var i=instancevalues.length-1;i>=0;i--) {
							 	instancevalue = new value.constructor(instancevalues[i]==="false" ? false : instancevalues[i]).valueOf()
								if(instancevalue > testvalue) {
									pass = pass.concat(me[scopekey][kindname][instancevalue].getIds());
									continue;
								}
								break;
							};
							break;
						// do un-optimized tests
						default:
							if(Object.joqularIndexes[kindname] && Object.joqularIndexes[kindname].index.keys[value.test] && Object.joqularIndexes[kindname].index.keys[value.test].Function) {
								instancevalues.forEach(function(instancevalue) {
									instancevalue = new Object.joqularIndexes[kindname](instancevalue);
									if(instancevalue[value.test](value)) {
										pass = pass.concat(me[scopekey][kindname][instancevalue].getIds());
									}
								});
							}
					}
				} else { // get the objects that support the type of test requested
					var kindnames = Object.keys(me[scopekey]);
					kindnames.forEach(function(kindname) {
						if(["Boolean","Number","String","Null"].indexOf(kindname)>=0) {
							return;
						}
						if(Object.joqularIndexes[kindname] && Object.joqularIndexes[kindname].index.keys[value.test] && Object.joqularIndexes[kindname].index.keys[value.test].Function) {
							pass = pass.concat(me[scopekey][kindname].getIds());
						}
					});
				}
			} else if(me[scopekey] && me[scopekey][kindname] && me[scopekey][kindname][testvalue]) { // test for direct matches
				pass = me[scopekey][kindname][testvalue].getIds();
			}
		// collect everything that supports the test being requested
		} else if(value.test) {
			var kindnames = Object.keys(me[scopekey]);
			kindnames.forEach(function(kindname) {
				if(Object.joqularIndexes[kindname] && Object.joqularIndexes[kindname].index.keys[value.test] && Object.joqularIndexes[kindname].index.keys[value.test].Function) {
					pass = pass.concat(me[scopekey][kindname].getIds());
				}
			});
		// walk other object
		} else if(me[scopekey][kindname] && me[scopekey][kindname].forgeinIds && Object.joqularIndexes[kindname]) {
			var fids = Object.keys(me[scopekey][kindname].forgeinIds);
			if(Object.joqularIndexes[kindname].index.find(value,fids)) {
				fids.forEach(function(fid) {
					pass.push(me[scopekey][kindname].forgeinIds[fid]);
				});
			}
		// walk keys and sub-objects
		} else if(kindname==="Pattern") {
			var keys = Object.keys(value);
			if(keys.every(function(key) {
				if(me[key] instanceof Key) {
					return me.find(index,value[key],pass,scopes,key,value[key].constructor.name);
				}
				return true;
			})) {
				// look in child objects in case key was not present
				var kindnames = Object.keys(me[scopekey]);
				kindnames.forEach(function(kindname) {
					if(me[scopekey][kindname].forgeinIds && Object.joqularIndexes[kindname]) {
						var fids = Object.keys(me[scopekey][kindname].forgeinIds);
						if(Object.joqularIndexes[kindname].index.find(value,fids)) {
							pass = pass.concat(me[scopekey][kindname].getIds());
						}
					}
				});
			}
		}
		if(pass.length===0) {
			results.splice(0,results.length);
			return false;
		}
		results.index = true;
		var tmp = (results.length>0 ? intersection(results,pass) : pass);
		results.splice.apply(results,[0,results.length].concat(tmp));
		return results.length>0;
	}
	function Value() {
		this.joqularIdMap = new Ids();
	}
	Value.prototype.getIds = function() {
		if(!this.joqularIds) {
			this.joqularIds = Object.keys(this.joqularIdMap);
		}
		return this.joqularIds;
	}
	function Method() {
		this.joqularIdMap = new Ids();
	}
	Method.prototype.getIds = function() {
		if(!this.joqularIds) {
			this.joqularIds = Object.keys(this.joqularIdMap);
		}
		return this.joqularIds;
	}
	function Pattern(init) {
		for(var key in init) {
			this[key] = init[key];
		}
	}
	function FindPattern(pattern,aliases) {
		this.compile(pattern,aliases);
	}
	FindPattern.prototype = new Pattern();
	FindPattern.prototype.defined = function(value) {
		return value!==undefined
	}
	FindPattern.prototype.compile = function(pattern,aliases,scope) {
		scope || (scope = this);
		var me = this, keys = Object.keys(pattern);
		keys.forEach(function(key) {
			if(key==="$forall" || key==="$exists") {
				return; // should only exist at top level, perhaps alias with every and exists and ih=gnore at top level?
			}
			if(key.indexOf("$$")===0) {
				return;
			}
			var value = (pattern[key]!=null ? pattern[key].valueOf() : pattern[key]), type = typeof(value); // converts pseudo primitive like Time, Duration to the primitive
			value = (value instanceof Date ? value.getTime() : value); // convert dates to numbers
			value = toObject(value);
			if(value.valueOf()!=null && type==="object") {
				if(value instanceof Array) {
					scope[key] = value;
				} else {
					var possibletest = Object.keys(value)[0];
					if(possibletest && (["$$"].indexOf(possibletest)>=0 || possibletest.indexOf("/")===0 || possibletest.indexOf(".")===0)) {
						value = me.defined;
						scope[key] = value; // just ensure key defined, leave resolution until final match, i.e. don't do in the index find, do against preliminary results 
					} else if(possibletest.indexOf("$")===0) {
						value = toObject(value[possibletest]);
						Object.defineProperty(value,"test",{enumerable:false,configurable:true,writable:true,value:possibletest.substring(1)});
						scope[key] = value;
					} else if(value instanceof Date) {
						scope[key] = value; // need to work on this;
					} else if(Object.keys(value).length===0) { // handle keyless objects like Sets
						value = me.defined;
						scope[key] = value; // handle outside of index
					} else if(typeof(me[possibletest])==="function") {
						var f = value[possibletest];
						value = function() {
							return me[possibletest](f,index,results,scope,scopekey,scopekind);
						}
						scope[key] = value;
					} else {
						scope[key] = new Pattern();
						me.compile(value,aliases,scope[key]);
					}
				}
			} else {
				Object.defineProperty(value,"test",{enumerable:false,configurable:true,writable:true,value:"eq"});
				scope[key] = value;
			}
		});
	}
	function MatchPattern(pattern,literals,aliases) {
		this.compile(pattern,literals,aliases);
	}
	MatchPattern.prototype = new Pattern();
	MatchPattern.prototype.compile = function(pattern,literals,aliases,scope) {
		scope || (scope = this);
		var me = this, keys = Object.keys(pattern), isfunction = false;
		keys.forEach(function(key) {
			if(key==="$forall" || key==="$exists") {
				return; // not relevant for object matching
			}
			var value = pattern[key], type = typeof(value); 
			if(key!=="$$" && key.indexOf("$")===0 && key.length>1) {
				key = key.substring(1);
				isfunction = true;
			}
			if(type==="function" || key.indexOf("..")===0 || key.indexOf("/")===0) {
				scope[key] = value;
			} else if(value!=null && type==="object") {
				var possibletest = Object.keys(value)[0];
				if(value[possibletest] && typeof(value[possibletest])==="object" && aliases) {
					var possiblealias = Object.keys(value[possibletest])[0];
					// arrays can't be tests and may actually exist to contain function arguments
					if(!(value[possibletest] instanceof Array) && aliases[possiblealias] || (aliases.indexOf && aliases.indexOf(possiblealias)>=0)) {
						return;
					}
				}
				if(["$lt","$lte","$eq","$neq","$gte","$gt"].indexOf(possibletest)>=0) {
					// ignore tests on primtives which were handled by index
					if(["Boolean","Number","String","Null"].indexOf(value.constructor.name)===-1) {
						var v = {};
						v[possibletest.substring(1)] = value[possibletest];
						scope[key] = v;
					}
				} else if(value.constructor.name!=="Object") {
					scope[key] = value;
				} else {
					scope[key] = {};
					me.compile(value,literals,aliases,scope[key]);
				}
			} else if(isfunction || literals){
				scope[key] = (value ? value.valueOf() : value);
			}
		});
	}
	function Index(kindName) {
		this.joqularIdMap = new Ids();
		this.keys = new Kind();
		this.nextId = 0;
		this.kindName = kindName;
	}
	Index.prototype.getIds = function() {
		if(!this.joqularIds) {
			this.joqularIds = Object.keys(this.joqularIdMap);
		}
		return this.joqularIds;
	}
	Index.prototype.index = function(instance) {
		var me = this, id, kind = me.keys, value, type, kindname = instance.constructor.name;
		if(["Boolean","Number","String","Null"].indexOf(kindname)===-1) {
			if(instance.joqularId==null) {
				id = me.nextId++;
				instance.joqularId = id;
			} else {
				id = instance.joqularId;
			}
			me.joqularIdMap[id] = instance;
		}
		for(var key in instance) {
			if(typeof(instance.valueOf())==="string" && typeof(instance[key])==="string") continue; // skip indexing strings by char
			value = (instance[key]!=null ? instance[key].valueOf() : instance[key]); // converts pseudo primitive like Time to the primitive
			value = (value instanceof Date ? value.getTime() : value); // convert dates to numbers
			value = toObject(value); 
			if(value===undefined) continue;
			kindname = value.constructor.name, type = typeof(value.valueOf());
			if(instance[key]===null) type = "undefined";
			// Object.joqularIndexes[kindname] || JOQULAR.createIndex(value.constructor);
			Object.joqularIndexes[kindname] || (Object.joqularIndexes[kindname] = value.constructor);
			Object.joqularIndexes[kindname].index || (Object.joqularIndexes[kindname].index = new Index(kindname));
			kind[key] || (kind[key] = new Key());
			kind[key][kindname] || (kind[key][kindname] = new Kind());
			if(id!=null) {
				kind[key][kindname].joqularIdMap[id] = 1;
			}
			if(["Boolean","Number","String","Null"].indexOf(kindname)>=0) {
				kind[key][kindname][value.valueOf()] || (kind[key][kindname][value.valueOf()] = new Value());
				kind[key][kindname][value.valueOf()].joqularIdMap[id] = 1;
				Object.joqularIndexes[kindname].index.index(value);
				// need to add some special stuff to enable restore of Dates, Durations, Times that have been convereted to primitives
				// if(value.valueOf()!==instance[key] || instance[key] instanceof Date) ...
			} else if(kindname!==me.kindName || value.joqularId!==id){
				if(value.joqularId==null) {
					Object.joqularIndexes[kindname].index.index(value);
				}
				kind[key][kindname].forgeinIds || (kind[key][kindname].forgeinIds = {});
				kind[key][kindname].forgeinIds[value.joqularId] = id; // how do we keep this updated for deletes?
			}
		}
		if(instance instanceof Array) {
			kind.length!=null || (kind.length = new Key());
			kind.length.Number || (kind.length.Number = new Kind());
			kind.length.Number[instance.length] || (kind.length.Number[instance.length] = new Value());
			kind.length.Number[instance.length].joqularIdMap[id] = 1;
			kind.length.Number.joqularIdMap[id] = 1;
		}
//		if(instance instanceof Function) {
//			kind.name!=null || (kind.name = new Key());
//			kind.name.String || (kind.name.String = new Kind());
//			kind.name.String[instance.name] || (kind.name.String[instance.name] = new Value());
//			kind.name.String[instance.name].joqularIdMap[id] = 1;
//			kind.name.String.joqularIdMap[id] = 1;
//		}
	}
	Index.prototype.find = function(pattern,aliases) {
		var me = this, findpattern = (pattern instanceof Pattern ? pattern : new FindPattern(pattern,aliases)), 
		matchpattern = (pattern instanceof Pattern ? pattern : new MatchPattern(pattern,false,aliases)),
		keys = Object.keys(findpattern), found = [], results = [];
		if(keys.every(function(key) {
			return me.keys.find(me,findpattern[key],found,[me.keys],key,findpattern[key].constructor.name);
		})) {
			if(pattern.$forall && !found.every(pattern.$forall)) {
				return [];
			}
			if(pattern.$exists && !found.some(pattern.$exists)) {
				return [];
			}
			var matchlength = Object.keys(matchpattern).length;
			found.forEach(function(id) {
				if(matchlength===0 || joqularMatch.call(me.joqularIdMap[id],matchpattern,aliases)) {
					results.push(me.joqularIdMap[id]);
				}
			});
			results.index = found.index;
		}
		return results;
	}
	function joqularIndexValue(id,value,index,key,type) {
		index[key] || (index[key] = {});
		index[key][type] || (index[key][type] = {});
		index[key][type][value] || (index[key][type][value] = {});
		index[key][type][value][id] = 1;
		delete index[key][type].joqularValues; // remove cached values, they will be regenerated by first query
	}
	function joqularIndexFunction(id,func,index,key) {
		if(func.predicate || func.provider) {
			index["function"] || (index["function"] = {});
			(index["function"][key] && typeof(index["function"][key])!=="function") || (index["function"][key] = {}); // index is a dumb object, so if there is a function, ok to overwrite
			index["function"][key][id] = 1;
		}
	}
	function joqularUpdate(id,changes,index) {
		var constructor = this;
		changes.forEach(function(change) {
			var key = change.name, value = change.object[key];
			if(change.type==="update" || change.type==="delete") {
				var type = typeof(change.oldValue);
				if(change.oldValue!==null && type==="object") {
					joqularDelete.call(constructor,id,change.oldValue,index[key]);
				} else if(index[key][type][change.oldValue]) {
					delete index[key][type][change.oldValue][id];
				}
			}
			if(change.type==="add") {
				index[key]={};
			}
			if(change.type==="update" || change.type==="add") {
				var value = change.object[key],type = typeof(value);
				if(value instanceof Object) {
					if(type==="function") {
						joqularIndexFunction.call(constructor,value,index,key);
					} else {
						joqularIndex.call(constructor,id,value,index[key]);
					}
				} else {
					joqularIndexValue.call(constructor,id,value,index,key,type)
				}
			}
			return;
		});
	}
	function joqularDelete(id,instance,index) {
		var constructor = this;
		if(index) {
			var keys = Object.keys(instance);
			keys.forEach(function(key) {
				if(index[key]) {
					var value = instance[key], type = typeof(value);
					if(value!==null && type==="object") {
						joqularDelete.call(constructor,value,index[key]);
					} else if(index[key][type] && index[key][type][value]){
						delete index[key][type][value][id];
					}
				}
			});
		}
	}
	function QueryPattern(pattern) {
		this.value = pattern;
	}
	QueryPattern.prototype.toJSON = function() {
		return this.value;
	}
	function Statement(projection) {
		
	}
	function Insert() {

	}
	Insert.prototype = new Statement();
	Insert.prototype.into = function(constructor) {
		this.impacts = [constructor]; // an array so it is consistent with other statements
		return this;
	}
	Insert.prototype.keys = function(keys) {
		this.keyNames = keys;
		this.insert = null;
		return this;
	}
	Insert.prototype.values = function(values) {
		this.keyValues = values;
		this.insert = null;
		return this;
	}
	Insert.prototype.object = function(object) {
		this.insert = object;
		this.keyNames = null;
		this.keyValues = null;
		return this;
	}
	Insert.prototype.exec = function(wait,persist) {
		persist = (persist || persist==null ? true : false);
		var me = this, constructor = me.impacts[0], object;
		if(me.keyNames && me.keyValues) {
			object = Object.create(constructor.prototype);
			Object.defineProperty(object,"constructor",{enumerable:false,value:me.impacts[0]});
			object.__proto__ = constructor.prototype;
			me.keyNames.forEach(function(key,i) {
				object[key] = me.keyValues[i];
			});
			constructor.joqularIndex(object);
			if(persist) {
				constructor.joqularSave();
			}
		} else if(me.insert) {
			object = me.insert;
			if(!(object instanceof me.impacts[0])) {
				var object = Object.create(constructor.prototype);
				Object.defineProperty(object,"constructor",{enumerable:false,value:me.impacts[0]});
				//object.constructor = constructor;
				object.__proto__ = constructor.prototype;
				var keys = Object.keys(me.insert);
				keys.forEach(function(key) {
					object[key] = me.insert[key];
				});
			}
			constructor.joqularIndex(object);
			if(persist) {
				constructor.joqularSave();
			}
		}
		return object;
	}
	Insert.prototype.toJSON = function() {
		var json = {};
		json.into = this.impacts[0].name;
		if(this.keyNames) {
			json.keys = this.keyNames;
		}
		if(this.values) {
			json.value = this.values;
		}
		if(this.object) {
			json.object = this.object;
		}
		return {insert: json};
	}
	function Select(projection) {
		this.projection = projection;
	}
	Select.prototype = new Statement();
	Select.prototype.exec = function(wait) {
		var me = this;
		function doit() {
			var aliasnames = Object.keys(me.aliases), selfs = [],  compare = {};
			if(!aliasnames.every(function(aliasname) {
				var pattern = {};
				if(me.patterns && me.patterns[aliasname]) {
					var keys = Object.keys(me.patterns[aliasname].value);
					keys.forEach(function(key) {
						if(key=="eq" || key=="neq") { // collect object comparisons
							compare[aliasname] || (compare[aliasname] = {});
							compare[aliasname][key] = me.patterns[aliasname].value[key];
							// reflexive test
							compare[me.patterns[aliasname].value[key]] || (compare[me.patterns[aliasname].value[key]] = {});
							compare[me.patterns[aliasname].value[key]][key] = aliasname;
						} else {
							pattern[key] = me.patterns[aliasname].value[key];
						}
					});
				}
				var matches = me.aliases[aliasname].joqularFind(pattern,false,aliasnames);
				if(matches.length===0) {
					if(!matches.index) {
						matches = [];
						var ids = me.aliases[aliasname].index.getIds();
						ids.forEach(function(id) {
							matches.push(me.aliases[aliasname].index.joqularIdMap[id]);
						});
					}
					if(matches.length===0) {
						return false;
					}
				}
				selfs.push(matches);
				return true;
			})) {
				return [];
			};
			if(selfs.length>0) {
				var rows = crossProduct(selfs,function(row,i) {
					if(me.firstCount!=null && i>=me.firstCount && !me.ordering && me.confidenceLevel==null && me.sampleSize==null) {
						return false;
					}
					var aliases = {};
					row.forEach(function(object,i) {
						aliases[aliasnames[i]] = object;
					});
					return row.every(function(object,i) {
							var aliasname = aliasnames[i], pattern = {};
							// compare objects if required
							if(compare[aliasname]) {
								var tests = Object.keys(compare[aliasname]);
								if(!tests.every(function(test) {
									var otheraliasnames = compare[aliasname][test];
									if(typeof(otheraliasnames)==="string") {
										otheraliasnames = [otheraliasnames];
									}
									return otheraliasnames.every(function(otheraliasname) {
										var j = aliasnames.indexOf(otheraliasname), otherobject = row[j];
										if(test==="eq") {
											return object===otherobject;
										} else { // neq
											return object!==otherobject;
										}
									});
								})) {
									return false;
								}
							}
							// get pattern for current object type
							if(me.patterns && me.patterns[aliasname]) {
								pattern = me.patterns[aliasname].value;
							}
							// match object to pattern, passing in aliases so that cross-references can be resolved
							if(object.joqularMatch(pattern,aliases)) {
								row[aliasname] = object;
								return true;
							}
							return false;
					});
				});
				if(me.sampleSize!=null || (me.confidenceLevel!=null && me.marginOfError!=null)) {
					if(me.randomize) {
						rows.sort(function(a,b) {
							return getRandomInt(-1,1);
						});
					}
					var size, samples = [];
					if(me.confidenceLevel!=null && me.marginOfError!=null) {
						size = sampleSize(me.confidenceLevel, me.marginOfError, rows.length)
					} else if(me.sampleSize>=1) {
						size = Math.floor(me.sampleSize);
					} else {
						size = Math.max(1,Math.round(me.sampleSize * rows.length));
					}
					if(size<rows.length) {
						while(samples.length < size) {
							var offset = getRandomInt(0,rows.length-1);
							samples.push(rows[offset]);
							rows.splice(offset,1);
						}
						rows = samples;
					}
				}
				if(me.ordering) {
					var sorter = new Sorter(), pathkeys = Object.keys(me.ordering);
					pathkeys.forEach(function(pathkey) {
						sorter.by(pathkey,me.ordering[pathkey]);
					});
					sorter.sort(rows);
				}
				if(me.firstCount!=null) {
					if(rows.length>me.firstCount) {
						rows = rows.slice(0,me.firstCount);
					}
				} else if(me.lastCount!=null) {
					if(rows.length>=me.lastCount) {
						rows = rows.slice(-me.lastCount);
					}
				}
				if(me.projection) {
					rows.forEach(function(row,i) {
						var projection = {}, columns = Object.keys(me.projection);
						var aliasnames = Object.keys(me.aliases);
						columns.forEach(function(column) {
							var reference = me.projection[column];
							aliasnames.some(function(aliasname) {
								if(reference[aliasname]) {
									var path = reference[aliasname].split(".");
									var value = row[aliasname];
									for(var i=0;i<path.length;i++) {
										value = value[path[i]];
										if(value===undefined) return;
									}
									if(JOQULAR.format && reference.format) {
										value = JOQULAR.format(refercen.format,value);
									}
									projection[column] = value;
									return true;
								}
								return false;
							});
						});
						rows[i] = [projection];
					});
				}
				return rows;
			}
			return [];
		}
		if(typeof(wait)==="function") {
			wait(null,doit())
		} else if(wait===true) {
			return new Promise(function(resolve,reject) {
				resolve(doit());
			});
		} else {
			return doit();
		}
	}
	Select.prototype.toJSON = function() {
		var me = this, json = {};
		if(me.projection) {
			json.projection = me.projection;
		}
		if(me.firstCount) {
			json.first = me.firstCount;
		} else if(me.lastCount) {
			json.last = me.firstCount;
		}
		if(me.sampleSize) {
			json.sample = me.sampleSize;
		}
		if(me.confidenceLevel) {
			json.sample = [me.confidenceLevel,me.marginOfError];
		}
		if(me.randomize) {
			json.randomize = me.randomize;
		}
		var aliases = Object.keys(me.aliases);
		aliases.forEach(function(alias) {
			json.from || (json.from = {});
			json.from[alias] = me.aliases[alias].name;
		});
		if(me.patterns) {
			aliases = Object.keys(me.patterns);
			aliases.forEach(function(alias) {
				json.where || (json.where = {});
				json.where[alias] = me.patterns[alias];
			});
		}
		if(me.ordering) {
			json.orderBy = me.ordering;
		}
		return {select: json};
	}
	//Select.prototype.into = function(constructor) {
	//	this.impacts = [constructor];
	//}
	Select.prototype.first = function(first) {
		this.firstCount = first;
		delete this.lastCount;
		return this;
	}
	Select.prototype.last = function(last) {
		this.lastCount = last;
		delete this.firstCount;
		return this;
	}
	Select.prototype.sample = function(sizeOrConfidenceLevel,randomizeOrMarginOfError,randomize) { // 2 args statistical, int count, float percent
		if(arguments.length>=2 && typeof(randomizeOrMarginOfError)==="number") {
			this.confidenceLevel = sizeOrConfidenceLevel;
			this.marginOfError = randomizeOrMarginOfError;
			this.randomize = randomize;
		} else if(arguments.length===1 || typeof(randomizeOrMarginOfError)==="boolean") {
			this.sampleSize = sizeOrConfidenceLevel;
			this.randomize = randomizeOrMarginOfError;
		}
		return this;
	}
	Select.prototype.from = function(aliases) {
		this.aliases = aliases;
		return this;
	}
	Select.prototype.where = function(patterns) {
		var me = this;
		me.patterns = {};
		var aliases = Object.keys(me.aliases), patternaliases = Object.keys(patterns);
		patternaliases.forEach(function(alias) {
			if(aliases.indexOf(alias)>=0) {
				me.patterns[alias] = new QueryPattern(patterns[alias]);
				return true;
			}
			throw new Error("The top level pattern " + JSON.stringify(new QueryPattern(patterns[alias])) + " does not refer to a class");
		});
		return me;
	}
	Select.prototype.orderBy = function(ordering) {
		this.ordering = ordering;
		return this;
	}
	var JOQULAR = {
			enhance: function(constructor,config) {
				Object.joqularIndexes = {};
				function createIndex(cons,auto,async,name) {
					auto = (auto===undefined ? true : auto);
					name || (name = cons.name);
					var newcons = Function("root","cons","auto","async","return function " + name + "() {var me = this;if(!(me instanceof " + name + ")) { me = new " + name + "(); } cons.apply(me,arguments); Object.defineProperty(me,'constructor',{enumerable:false,value:" + name + "}); return (auto ? " + name + ".joqularIndex(me,async) : me); }")(constructor,cons,auto,async);
					Object.joqularIndexes[name] = newcons;
					var keys = Object.getOwnPropertyNames(constructor);
					keys.forEach(function(key) {
						try {
							newcons[key] = constructor[key];
						} catch(e) {
							
						}
					});
					keys = Object.getOwnPropertyNames(cons);
					keys.forEach(function(key) {
						try {
							newcons[key] = cons[key];
						} catch(e) {
							
						}
					});
					newcons.index = new Index(name);
					newcons.indexing = {};
					Object.defineProperty(newcons,"joqularClear",{enumerable:false,value:function(indexOnly,asynch) {
						var count = Object.keys(newcons.ids).length-1;
						newcons.ids = {};
						newcons.ids.nextId = 0;
						newcons.index = {};
						var promise;
						if(!indexOnly && newcons.joqularSave) {
							promise = newcons.joqularSave();
						} else {
							promise = new Promise(function(resolve,reject) { resolve(); });
						}
						if(typeof(asynch)==="function") {
							promise.then(function(count) {
								asynch(null,count);
							})["catch"](function(e) {
								asynch(e);
							});
							return null;
						}
						return promise;
					}});
					Object.defineProperty(newcons,"joqularFlush",{enumerable:false,value:function(id) {
						var ids;
						if(id!=null) {
							ids = [id];
						} else {
							ids = newcons.index.getIds();
						}
						ids.forEach(function(id) {
							newcons.index.joqularIdMap[id] = 1;
						});
					}});
					Object.defineProperty(newcons,"joqularRestore",{enumberable:false,value:function(id) {
						var ids, results = {};
						if(id!=null) {
							ids = [id];
						} else {
							ids = newcons.index.getIds();
						}
						ids.forEach(function(id) {
							var object = newcons.index.joqularIdMap[id];
							if(!object) {
								return;
							}
							if(object===1) {
								object = Object.create(newcons.prototype);
								Object.defineProperty(object,"constructor",{enumerable:false,configurable:true,writable:true,value:newcons});
								object.__proto__ = newcons.prototype;
								var keys = Object.keys(newcons.index.keys);
								keys.forEach(function(key) {
									var kindnames = Object.keys(newcons.index.keys[key]);
									kindnames.forEach(function(kindname) {
											if(["Boolean","Number","String","Null"].indexOf(kindname)>=0) { // FUnction??
												var values = Object.keys(newcons.index.keys[key][kindname]);
												values.forEach(function(value) {
													if(newcons.index.keys[key][kindname][value][id]) {
														switch(kindname) {
														case "Boolean": object[key] = (value==="true" ? true : false); break;
														case "Number": object[key] = parseFloat(value); break;
														case "String" : object[key] = value; break;
														case "Null" : object[key] = null;
														}
													}
												});
											} else {
												// joqularRestore(object,newcons.index[key][type]);
											}
										});
								});
								newcons.index.joqularIdMap[id] = object;
								results[id] = object;
							}	
						});
						return results;
					}});
					newcons.prototype = Object.create(cons.prototype);
					if(config.datastore && config.datastore.name && config.datastore.type==="IndexedDB") {
						Object.defineProperty(newcons,"joqularSave",{enumerable:false,value:function(aysnch) {
							var me = this, tid;
							var promise = new Promise(function(resolve,reject) {
								me.dbVersion || (me.dbVersion = 1);
								var dbrequest = indexedDB.open(config.datastore.name,me.dbVersion);
								dbrequest.onupgradeneeded = function(event) {
									var db = event.target.result;
									if(!db.objectStoreNames.contains(name)) {
										db.createObjectStore(name, {  autoIncrement : true });
									}
								};
								dbrequest.onblocked = function(event) {
									reject(event);
								};
								dbrequest.onerror = function(event) {
									if(event.target.error.name==="VersionError" && event.target.error.message.indexOf(" less ")>=0) {
										event.cancelBubble = true;
										me.dbVersion++;
										me.joqularSave();
									} else {
										reject(event);
									}
								};
								dbrequest.onsuccess = function(event) {
									var db = event.target.result, objectstore;
									if(!db.objectStoreNames.contains(name)) {
										db.close();
										me.dbVersion++;
										me.joqularSave();
									} else {
										objectstore = db.transaction(name, "readwrite").objectStore(name);
										var request = objectstore.get("root");
										request.onsuccess = function(event) {
											var object = request.result;
											if(!object) {
												objectstore.add({ids:me.ids,index:me.index},"root");
											} else {
												object.ids = me.ids;
												object.index = me.index;
												objectstore.put(object,"root");
											}
											db.close();
											var count = me.index.getIds().length - 1; // -1 for nextId key
											resolve(count);
										};
										request.onerror = function(event) {
											reject(event);
										}
									}
								};
							});
							if(typeof(asynch)==="function") {
								promise.then(function(count) {
									asynch(null,count);
								})["catch"](function(e) {
									asynch(e);
								});
								return null;
							} 
							/*else if(typeof(asynch)==="number") {
								tid = setTimeout(function() { tid = null; });
								
							}*/
							return promise;
						}});
						Object.defineProperty(newcons,"joqularLoad",{enumerable:false,value:function(aysnch) {
							var me = this;
							var promise = new Promise(function(resolve,reject) {
								me.dbVersion || (me.dbVersion = 1);
								var dbrequest = indexedDB.open(config.datastore.name,me.dbVersion);
								dbrequest.onupgradeneeded = function(event) {
									var db = event.target.result;
									if(!db.objectStoreNames.contains(name)) {
										db.createObjectStore(name, {  autoIncrement : true });
									}
								};
								dbrequest.onblocked = function(event) {
									console.log(event);
									reject(event)
								};
								dbrequest.onerror = function(event) {
									if(event.target.error.name==="VersionError" && event.target.error.message.indexOf(" less ")>=0) {
										event.cancelBubble = true;
										me.dbVersion++;
										me.joqularLoad();
									} else {
										reject(event)
									}
								};
								dbrequest.onsuccess = function(event) {
									var db = event.target.result, objectstore;
									if(!db.objectStoreNames.contains(name)) {
										db.close();
										me.dbVersion++;
										me.joqularLoad();
									} else {
										objectstore = db.transaction(name).objectStore(name);
										// look for checkpoints from failed transaction,
										// if found, restore the checkpoint
										
										// else ...
										var request = objectstore.get("root");
										request.onsuccess = function(event) {
											var object = request.result;
											if(object) {
												me.ids = {};
												var keys = Object.keys(object.ids);
												keys.forEach(function(id) {
													if(id!=="nextId") {
														me.ids[id] = Object.create(me.prototype);
														for(var property in object.ids[id]) {
															me.ids[id][property] = object.ids[id][property];
														}
														Object.defineProperty(me.ids[id],"constructor",{enumerable:false,value:me});
														me.ids.nextId = parseInt(id)+1;
													}
												});
												me.index = object.index;
											} else {
												me.ids = {};
												me.ids.nextId = 0;
												me.index = {};
											}
											db.close();
											var count = Object.keys(me.ids).length - 1; // -1 for nextId key
											resolve(count);
										};
									}
								};
							});
							if(typeof(asynch)==="function") {
								promise.then(function(count) {
									asynch(null,count);
								})["catch"](function(e) {
									asynch(e);
								});
								return null;
							}
							return promise;
						}});
					}
					return newcons;
				}
				if(config.index===true) {
					config.enhancePrimitives = true;
					config.enhanceArray = true;
					config.ehhanceDate = true;
					Object.defineProperty(constructor,"joqularFind",{enumarable:false,value:function(pattern,wait,aliasnames) {
						var me = this;
						function dowait(f) {
							if(Object.keys(me.indexing).length===0) {
								f();
							} else {
								setTimeout(function() { dowait(f) },100);
							}
						}
						var me = this;
						if(wait) {
							if(typeof(wait)==="function") {
								dowait(function() {  
									wait(null,me.index.find(pattern,aliasnames));  
								});
							} else {
								return new Promise(function(resolve,reject) {
									dowait(function() { resolve(me.index.find(pattern,aliasnames)); });
								});
							}
						}
						return me.index.find(pattern,aliasnames)
						//return joqularFind.call(me,pattern,me.index,aliasnames);
					}});
					Object.defineProperty(constructor,"joqularIndex",{enumarable:false,value:function(instance,async) {
						var me = this;
						if(async) {
							var tid;
							if(typeof(async)==="function") {
								tid = setTimeout(function() { me.index.index(instance); delete me.indexing[tid]; async(instance); },0);
								//tid = setTimeout(function() { joqularIndex.call(me,id,instance,me.index); delete me.indexing[tid]; async(instance); },0);
								me.indexing[tid] = true;
								return tid;
							} else {
								var promise = new Promise(function(resolve,reject) {
									tid = setTimeout(function() { me.index.index(instance); delete me.indexing[tid]; resolve(instance); },0);
									//tid = setTimeout(function() { joqularIndex.call(me,id,instance,me.index); delete me.indexing[tid]; resolve(instance); },0);
								});
								me.indexing[tid] = promise;
								return promise;
							}
						}
						me.index.index(instance); 
						return instance;
					}});
				};
				function Time(value,precision) {
					if(value==null) {
						value = new Date().getTime()
					} else if(value.constructor===Time || value instanceof Time) {
						value = value.value;
					} else if(value instanceof Date) {
						value = value.getTime();
					} else if(value instanceof TimeSpan) {
						value = value.startingTime.valueOf();
					} else if(typeof(value)==="string") {
						value = Date.parse(value);
					}
					this.value = value;
					this.toPrecision(precision,true);
					Object.defineProperty(this,"constructor",{enumerable:false,configurable:true,writable:true,value:Time});
				};
				Time.prototype = Object.create(constructor.prototype);
				Time.prototype.valueOf = function() {
					return this.value;
				};
				Time.prototype.withPrecision = function(precision) {
					return this.toPrecision(precision,false);
				};
				Time.prototype.toPrecision = function(precision,modify) {
					modify = (modify || modify==null ? true : false);
					if(!precision || this.value===Infinity || this.value===-Infinity || isNaN(this.value)) {
						if(modify) {
							return this;
						}
						return new Time(this.value);
					}
					var Y1 = this.getFullYear();
					var M1 = (["M","D","h","m","s","ms"].indexOf(precision)!==-1 ? this.getMonth() : null);
					var D1 = (["D","h","m","s","ms"].indexOf(precision)!==-1 ? this.getDate() : null);
					var h1 = (["h","m","s","ms"].indexOf(precision)!==-1 ? this.getHours() : null);
					var m1 = (["m","s","ms"].indexOf(precision)!==-1 ? this.getMinutes() : null);
					var s1 = (["s","ms"].indexOf(precision)!==-1 ? this.getSeconds() : null);
					var ms1 = (["ms"].indexOf(precision)!==-1 ? this.getMilliseconds() : null);
					var date = new Date(Y1,M1,D1,h1,m1,s1,ms1);
					if(modify) {
						this.setTime(date.getTime());
						return this;
					}
					return new Time(date);
				};
				Time.prototype.lt = toPredicate(function(value,precision) {
					return new Time(this).withPrecision(precision).valueOf() < new Time(value,precision).valueOf();
				});
				Time.prototype.lte = toPredicate(function(value,precision) {
					if(value===this) {
						return true;
					}
					return new Time(this).withPrecision(precision).valueOf() <= new Time(value,precision).valueOf();
				});
				Time.prototype.eq = toPredicate(function(value,precision) {
					if(value===this) {
						return true;
					}
					return new Time(this).withPrecision(precision).valueOf() === new Time(value,precision).valueOf();
				});
				Time.prototype.neq = toPredicate(function(value,precision) {
					return new Time(this).withPrecision(precision).valueOf() !== new Time(value,precision).valueOf();
				});
				Time.prototype.gte = toPredicate(function(value,precision) {
					if(value===this) {
						return true;
					}
					return new Time(this).withPrecision(precision).valueOf() >= new Time(value,precision).valueOf();
				});
				Time.prototype.gt = toPredicate(function(value,precision) {
					return new Time(this).withPrecision(precision).valueOf() > new Time(value,precision).valueOf();
				});
				Time.prototype["in"] = toPredicate(function(value,precision) {
					if(value instanceof TimeSpan) {
						return value.contains(this);
					}
					return new Time(this,precision).valueOf() === new Time(value,precision).valueOf();
				});
				var dateProperties = {
					getDate: null,
					getDay: null,
					getFullYear: null,
					getHours: null,
					getMilliseconds: null,
					getMinutes: null,
					getMonth: null,
					getSeconds: null,
					getTime: null,
					getTimezoneOffset: null,
					getUTCDate: null,
					getUTCDay: null,
					getUTCFullYear: null,
					getUTCHours: null,
					getUTCMilliseconds: null,
					getUTCMinutes: null,
					getUTCMonth: null,
					getUTCSeconds: null,
					getYear: null,
					parse: null,
					setDate: null,
					setFullYear: null,
					setHours: null,
					setMilliseconds: null,
					setMinutes: null,
					setMonth: null,
					setSeconds: null,
					setTime: null,
					setUTCDate: null,
					setUTCFullYear: null,
					setUTCHours: null,
					setUTCMilliseconds: null,
					setUTCMinutes: null,
					setUTCMonth: null,
					setUTCSeconds: null,
					setYear: null,
					toDateString: null,
					toGMTString: null,
					toISOString: null,
					toLocaleDateString: null,
					toLocaleTimeString: null,
					toLocaleString: null,
					toString: null,
					toTimeString: null,
					toUTCString: null,
					UTC: null
				}
				Object.keys(dateProperties).forEach(function(key) {
					if(!Time.prototype[key]) {
						Time.prototype[key] = function() {
								var dt = new Date(this.value);
								var result = dt[key].apply(dt,arguments);
								this.value = dt.getTime();
								return result;
						}
					}
				});
				function Duration(value,period) {
					period || (period = "ms");
					if(value.constructor===Duration || value instanceof Duration) {
						period = "ms";
						value = value.valueOf();
					}
					this.value = value * Duration.factors[period];
					this.range = 0;
					Object.defineProperty(this,"constructor",{enumerable:false,configurable:true,writable:true,value:Duration});
				};
				Duration.factors = {
						Y: 31557600*1000,
						M: (31557600*1000)/12, // psuedo-month
						D: 24 * 60 * 60 * 1000,
						h: 60 * 60 * 1000,
						m: 60 * 1000,
						s: 1000,
						ms: 1
					}
				Duration.prototype = Object.create(constructor.prototype);
				Duration.prototype.valueOf = function() {
					return this.value;
				};
				Duration.prototype.lt = toPredicate(function(value,period) {
					period || (period = "s");
					return this.valueOf() / Duration.factors[period] < new Duration(value).valueOf()  / Duration.factors[period];
				});
				Duration.prototype.lte = toPredicate(function(value,period) {
					if(value===this) {
						return true;
					}
					period || (period = "s");
					return this.valueOf() / Duration.factors[period] <= new Duration(value).valueOf()  / Duration.factors[period];
				});
				Duration.prototype.eq = toPredicate(function(value,period) {
					if(value===this) {
						return true;
					}
					period || (period = "s");
					return this.valueOf() / Duration.factors[period] === new Duration(value).valueOf()  / Duration.factors[period];
				});
				Duration.prototype.neq = toPredicate(function(value,period) {
					period || (period = "s");
					return this.valueOf() / Duration.factors[period] !== new Duration(value).valueOf()  / Duration.factors[period];
				});
				Duration.prototype.gte = toPredicate(function(value,period) {
					if(value===this) {
						return true;
					}
					period || (period = "s");
					return this.valueOf() / Duration.factors[period] >= new Duration(value).valueOf()  / Duration.factors[period];
				});
				Duration.prototype.gt = toPredicate(function(value,period) {
					period || (period = "s");
					return this.valueOf() / Duration.factors[period] > new Duration(value).valueOf()  / Duration.factors[period];
				});
				Duration.prototype.atLeast = function() {
					this.range = -1;
				};
				Duration.prototype.atMost = function() {
					this.range = 1;
				};
				Duration.prototype.exact = function() {
					this.range = 0;
				};
				// need to define gt, lt etc. in context of range
				function TimeSpan(startingTime,endingTime) {
					if((startingTime && startingTime.constructor===TimeSpan) || startingTime instanceof TimeSpan) {
						return new TimeSpan(startingTime.startingTime,startingTime.endingTime);
					}
					this.startingTime = (startingTime!=null ? new Time(startingTime) : new Time(-Infinity));
					this.endingTime = (endingTime!=null ? new Time(endingTime) : new Time(Infinity));
					Object.defineProperty(this,"duration",{enumerable:true,configurable:false,get:function() { return this.endingTime - this.startingTime}, set: function() {}});
					Object.defineProperty(this,"constructor",{enumerable:false,configurable:true,writable:true,value:TimeSpan});
				};
				TimeSpan.prototype = Object.create(constructor.prototype);
				TimeSpan.prototype.contains = toPredicate(function(value,precision) {
					var startingTime = new Time(value.startingTime,precision);
					var endingTime = new Time(value.endingTime,precision);
					var time = new Time(value,precision);
					return startingTime.valueOf() <= time.valueOf() <= endingTime.valueOf();
				});
				TimeSpan.prototype.intersects = toPredicate(function(value,precision) {
					var startingTime = new Time(value.startingTime,precision);
					var endingTime = new Time(value.endingTime,precision);
					if(this.startingTime>=startingTime && this.startingTime<=endingTime) {
						return true;
					}
					if(this.endingTime<=value.endingTime && this.endingTime>=startingTime) {
						return true;
					}
					return false;
				});
				TimeSpan.prototype.disjoint = toPredicate(function(value,precision) {
					return !this.intersects(value,precision);
				});
				TimeSpan.prototype.coincident = toPredicate(function(value,precision) {
					var startingTime, endingTime;
					if(value instanceof Date || typeof(value)==="number") {
						startingTime = endingTime = new Time(value,precision);
					} else {
						startingTime = new Time(value.startingTime,precision);
						endingTime = new Time(value.endingTime,precision);
					}
					return new Time(this.startingTime,precision).valueOf()==startingTime.valueOf() && new Time(this.endingTime,precision).valueOf()==endingTime.valueOf();
				})
				TimeSpan.prototype.eq = toPredicate(function(value,precision) {
					if(this===value) {
						return true;
					}
					if(!(value instanceof TimeSpan)) {
						return false;
					}
					return new Time(this.startingTime,precision).valueOf() === new Time(value.startingTime,precision).valueOf() &&
						new Time(this.endingTime,precision).valueOf() === new Time(value.endingTime,precision).valueOf();
				});
				TimeSpan.prototype.adjacentOrBefore = toPredicate(function(value,precision) {
					return new Time(this.endingTime+new Duration(1,precision),precision).valueOf() <= new Time(value,precision).valueOf();
				});
				TimeSpan.prototype.before = toPredicate(function(value,precision) {
					return new Time(this.endingTime+new Duration(1,precision),precision).valueOf() < new Time(value,precision).valueOf();
				});
				TimeSpan.prototype.adjacentBefore = toPredicate(function(value,precision) {
					return new Time(this.endingTime+new Duration(1,precision),precision).valueOf() === new Time(value,precision).valueOf();
				});
				TimeSpan.prototype.adjacentOrAfter = toPredicate(function(value,precision) {
					var endingTime;
					if(value.constructor===TimeSpan || value instanceof TimeSpan) {
						endingTime = new Time(value.endingTime,precision);
					} else {
						endingTime = new Time(value,precision);
					}
					return new Time(this.startingTime-new Duration(1,precision),precision).valueOf() >= endingTime.valueOf();
				});
				TimeSpan.prototype.after = toPredicate(function(value,precision) {
					var endingTime;
					if(value.constructor===TimeSpan || value instanceof TimeSpan) {
						endingTime = new Time(value.endingTime,precision);
					} else {
						endingTime = new Time(value,precision);
					}
					return new Time(this.startingTime-new Duration(1,precision),precision).valueOf() > endingTime.valueOf();
				});
				TimeSpan.prototype.adjacentAfter = toPredicate(function(value,precision) {
					var endingTime;
					if(value.constructor===TimeSpan || value instanceof TimeSpan) {
						endingTime = new Time(value.endingTime,precision);
					} else {
						endingTime = new Time(value,precision);
					}
					return new Time(this.startingTime-new Duration(1,precision),precision).valueOf() == endingTime.valueOf();
				});
				TimeSpan.prototype.adjacent = toPredicate(function(value,precision) {
					if(this.adjacentBefore(value,precision)) {
						return -1;
					}
					if(this.adjacentAfter(value,precision)) {
						return 1;
					}
					return 0;
				});
				Object.defineProperty(constructor.prototype,"joqularMatch",{enumerable:false,value:function(pattern,aliases,scope) {
					return joqularMatch.call(this,new MatchPattern(pattern,true),aliases,scope);
				}});
				Object.defineProperty(constructor.prototype,"instanceof",{enumerable:false,configurable:true,writable:true,value:toPredicate(function(constructor) {
					return this instanceof constructor;
				})});
				Object.defineProperty(constructor.prototype,"eq",{enumerable:false,configurable:true,writable:true,value:toPredicate(function(value) {
					// first clause handles an object or primitve and value===null or value===undefined
					// second clause handles everything else because primitives and Objects will return themselves with .valueOf()
					// array and other types of objects may need to override eq
					return this.valueOf() === value || 
						(value!=null && this.valueOf() === value.valueOf());
				})});
				Object.defineProperty(constructor.prototype,"neq",{enumerable:false,configurable:true,writable:true,value:toPredicate(function(value) {
					return !this.eq(value);
				})});
				if(config.enhancePrimitives) {
					[Number,String,Boolean].forEach(function(primitive) {
						primitive.prototype.joqularMatch || (primitive.prototype.joqularMatch = constructor.prototype.joqularMatch);
						(primitive.prototype.lt = function(value) {
							return this.valueOf() < value || this.valueOf() < value.valueOf();
						}).predicate=true;
						(primitive.prototype.lte = function(value) {
							return this.valueOf() <= value || this.valueOf() <= value.valueOf();
						}).predicate=true;
						(primitive.prototype.eq = function(value) {
							value = toObject(value);
							return this === value || (value!==undefined && this.valueOf() === value.valueOf());
						}).predicate=true;
						(primitive.prototype.neq = function(value) {
							return !this.eq(value);
						}).predicate=true;
						(primitive.prototype.gte = function(value) {
							return this.valueOf() >= value || this.valueOf() >= value.valueOf();
						}).predicate=true;
						(primitive.prototype.gt = function(value) {
							return this.valueOf() > value || this.valueOf() > value.valueOf();
						}).predicate=true;
						(primitive.prototype["in"] = function(value) {
							return value && value.contains && value.contains(this);
						}).predicate=true;
						(primitive.prototype.nin = function(value) {
							return !value || !value.contains || !value.contains(this);
						}).predicate=true;
						primitive.prototype.between = toPredicate(function(bound1,bound2) {
							return (this.valueOf() >= bound1 && this.valueOf() <= bound2) || (this.valueOf() >= bound2 && this.valueOf() <= bound1);
						});
						primitive.prototype.outside = toPredicate(function(bound1,bound2) {
							return !this.between(bound1,bound2);
						});
					});
				}
				String.prototype.echoes = toPredicate(function(value) {
					return soundex(this)===soundex(value);
				});
				String.prototype.soundex = String.prototype.echoes;
				Object.defineProperty(String.prototype,"match",{enumerable:true,configurable:true,writable:true,value:String.prototype.match});
				String.prototype.match.predicate = true;
				if(config.enhanceDate) {
					Date.prototype.joqularMatch || (Date.prototype.joqularMatch = constructor.prototype.joqularMatch);
					Object.defineProperty(Date.prototype,"time",{enumerable:true,configurable:false,set:function() { return; },get:function() { return this.getTime(); }});
					Date.prototype.lt = toPredicate(function(value,precision) {
						if(value instanceof TimeSpan) {
							return value.after(this,precision);
						}
						return new Time(this,precision) < new Time(value,precision);
					});
					Date.prototype.lte = toPredicate(function(value,precision) {
						if(value instanceof TimeSpan) {
							return value.adjacentOrAfter(this,precision);
						}
						return new Time(this,precision) <= new Time(value,precision);
					});
					Date.prototype.eq = toPredicate(function(value,precision) {
						if(value===this) {
							return true;
						}
						if(value instanceof Date && this.time===value.time) {
							return true;
						}
						if(value instanceof TimeSpan) {
							return value.coincident(this,precision);
						}
						return new Time(this,precision).valueOf() == new Time(value,precision).valueOf();
					});
					Date.prototype.neq = toPredicate(function(value,precision) {
						return new Time(this,precision).valueOf() !== new Time(value,precision).valueOf();
					});
					Date.prototype.gte = toPredicate(function(value,precision) {
						if(value instanceof TimeSpan) {
							return value.adjacentOrBefore(this,precision);
						}
						return new Time(this,precision).valueOf() >= new Time(value,precision).valueOf();
					});
					Date.prototype.gt = toPredicate(function(value,precision) {
						if(value instanceof TimeSpan) {
							return value.adjacentOrBefore(this,precision);
						}
						return new Time(this,precision).valueOf() >= new Time(value,precision).valueOf();
					});
					Date.prototype.before = Date.prototype.lt;
					Date.prototype.adjacentOrBefore = Date.prototype.lte;
					Date.prototype.after = Date.prototype.gt;
					Date.prototype.adjacentOrAfter = Date.prototype.gte;
					Date.prototype.coincident = toPredicate(function(value,precision) {
						if(value instanceof TimeSpan) {
							var d = new TimeSpan(this,this);
							return d.coincident(value,precision);
						}
						return this.eq(value,precision);
					});
					Date.prototype.disjoint = toPredicate(function(value,precision) {
						if(value instanceof TimeSpan) {
							var d = new TimeSpan(this,this);
							return d.disjoint(value,precision);
						}
						return this.neq(value,precision);
					});
					Date.prototype.intersects = toPredicate(function(value,precision) {
						if(value instanceof TimeSpan) {
							var d = new TimeSpan(this,this);
							return d.intersects(value,precision);
						}
						return this.eq(value,precision);
					});
				}
				if(config.enhanceArray) {
					Array.prototype.joqularMatch || (Array.prototype.joqularMatch = constructor.prototype.joqularMatch);
					Array.prototype.count = toProvider(function(type) {
						return (!type ? this.length : this.filter(function(item) { return item && typeof(item.valueOf())===type; }).length);
					});
					Array.prototype.avg = toProvider(function(ignoreEnds) {
						var sum = 0;
						var copy = this.filter(function(item) { return item!=null && typeof(item.valueOf())==="number" && !isNaN(item.valueOf()); }).sort(function(a,b) { return a - b;});
						if(ignoreEnds && copy.length>2) {
							copy.shift();
							copy.pop();
						}
						for(var i=0;i<copy.length;i++) {
							sum += this[i].valueOf();
						}
						return sum / copy.length;
					});
					Array.prototype.stdev = toProvider(function(ignoreEnds) {
						return Math.sqrt(this.variance(ignoreEnds));
					})
					Array.prototype.variance = toProvider(function(ignoreEnds)
					{
					    var len = 0;
					    var sum = 0;
					    var arr = this.filter(function(item) { return item!=null && typeof(item.valueOf())==="number" && !isNaN(item.valueOf()); }).sort(function(a,b) { return a - b;});
						if(ignoreEnds && arr.length>2) {
							arr.shift();
							arr.pop();
						}
					    for(var i=0;i<arr.length;i++)
					    {
					             len = len + 1;
					             sum = sum + arr[i].valueOf(); 
					    }
					    var v = 0;
					    if (len > 1)
					    {
					        var mean = sum / len;
					        for(var i=0;i<arr.length;i++)
					        {
					              v = v + (arr[i] - mean) * (arr[i] - mean);                 
					        }
					        return v / len;
					    }
					    else
					    {
					       return 0;
					    }    
					});
					Array.prototype.every.predicate = true;
					Array.prototype.some.predicate = true;
					Array.prototype.sum = toProvider(function(ignoreEnds) {
						var sum = 0;
						var copy = this.filter(function(item) { return item!=null && typeof(item.valueOf())==="number" && !isNaN(item.valueOf()); }).sort(function(a,b) { return a - b;});
						if(ignoreEnds && copy.length>2) {
							copy.shift();
							copy.pop();
						}
						for(var i=0;i<copy.length;i++) {
							sum += this[i].valueOf();
						}
						return sum;
					});
					Array.prototype.min = toProvider(function(type,ignoreEnds) {
						type || (type="number");
						var i = 0;
						var copy = this.filter(function(item) { return item!=null && typeof(item.valueOf())===type && (!type==="number" || !isNaN(item.valueOf())); });
						if(type==="number") {
							copy.sort(function(a,b) { return a.valueOf() - b.valueOf();});
						} else {
							copy.sort();
						}
						if(ignoreEnds && copy.length>2) i++;
						return copy[i];
					});
					Array.prototype.max = toProvider(function(type,ignoreEnds) {
						type || (type="number");
						var copy = this.filter(function(item) { return item!=null && typeof(item.valueOf())===type && (!type==="number" || !isNaN(item.valueOf())); });
						if(type==="number") {
							copy.sort(function(a,b) { return a.valueOf() - b.valueOf();});
						} else {
							copy.sort();
						}
						var i = copy.length-1;
						if(ignoreEnds  && copy.length>2) i--;
						return copy[i];
					});
					Array.prototype.bsearch = function(value,sorter) {
						var me = this;
						if(sorter) {
							me = this.slice(0).sort(sorter);
						}
						return binarySearch(me,value);
					};
					Array.prototype.eq = toPredicate(function(value) {
						if(this===value) { return true; }
						if(!(value instanceof Array) || this.length!==value.length) {
							return false;
						}
						return this.every(function(item,i) {
							var v = value[i];
							if(item===v) {
								return true;
							}
							if(item instanceof constructor) {
								return item.eq(v);
							}
						});
					});
					Array.prototype.neq =  toPredicate(function(value) {
						return !this.eq(value);
					});
					Array.prototype.intersects =  toPredicate(function(value) {
						if(value instanceof Set) {
							value = Set.toArray()
						}
						var result = intersection(this,value);
						return result && result.length>0;
					});
					Array.prototype.disjoint =  toPredicate(function(value) {
						return !this.intersects(value);
					});
					Array.prototype.coincident =  toPredicate(function(value) {
						return this.count() === value.count() &&
							this.every(function(item) {
								return value.contains(item);
							});
					});					
					Array.prototype.contains =  toPredicate(function(value) {
						return this.some(function(item) {
							if(item===value ||
								(item!=null && item.valueOf()===value) ||
								(value!=null && item===value.valueOf()) || 
								(item!=null && value!=null && item.valueOf()===value.valueOf())) {
								return true;
							}
							if(typeof(item.eq)==="function") {
								return item.eq(value);
							}
							return false;
						});
					});
					Array.prototype.includes = Array.prototype.contains;
					Array.prototype.excludes =  toPredicate(function(value) {
						return !this.includes(value);
					});
				}
				if(config.enhanceSet) {
					Set.prototype.joqularMatch || (Set.prototype.joqularMatch = constructor.prototype.joqularMatch);
					Set.prototype.count = function() {
						return this.size;
					};
					Set.prototype.toArray = function() {
						var array = [];
						this.forEach(function(item) {
							array.push(item);
						})
						return array;
					};
					Set.prototype.every =  toPredicate(function(f) {
						var array = this.toArray();
						return array.every(f)
					});
					Set.prototype.some =  toPredicate(function(f) {
						var array = this.toArray();
						return array.some(f)
					});
					Set.prototype.indexOf = function(value) {
						var array = this.toArray();
						return array.indexOf(value);
					};
					Set.prototype.contains =  toPredicate(function(value) {
						return (!value && this.has(value)) || this.has(value.valueOf());
					});
					Set.prototype.eq =  toPredicate(function(value) {
						var me = this;
						if(this===value) { return true; }
						if(!(value instanceof Set) || this.size!==value.size) {
							return false;
						}
						return me.every(function(item) {
							return value.has(item);
						});
					});
					Set.prototype.neq =  toPredicate(function(value) {
						return !this.eq(value);
					});
					Set.prototype.intersects =  toPredicate(function(value) {
						if(!value || typeof(value.contains)!=="function") {
							return false;
						}
						return this.some(function(item) {
							return value.contains(item);
						});
					});
					Set.prototype.disjoint =  toPredicate(function(value) {
						return !this.intersects(value);
					});
					Set.prototype.coincident =  toPredicate(function(value) {
						return typeof(value.count)==="function" && 
							this.count() === value.count() &&
							this.every(function(item) {
								return value.contains(item);
							});
					});
					Set.prototype.includes = Set.prototype.contains;
					Set.prototype.excludes =  toPredicate(function(value) {
						return !this.includes(value);
					});
				}
				JOQULAR.createIndex = createIndex;
				JOQULAR.insert = function() {
					return new Insert();
				}
				JOQULAR.select = function(projection) {
					return new Select(projection);
				}
				JOQULAR.TimeSpan = TimeSpan;
				JOQULAR.Time = Time;
				JOQULAR.Duration = Duration;
				return constructor;
			}
		}
	exports.JOQULAR = JOQULAR;
})("undefined"!=typeof exports&&"undefined"!=typeof global?global:window);