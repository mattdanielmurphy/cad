'useclient'

import { DxfWriter, point3d } from '@tarikjabiri/dxf'

import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState } from 'react'

const dxf = new DxfWriter()
function writeDXFStringToFile(dxfString:string) {
	fetch('/api/writeFile', {method:'POST', body: dxfString})
}

function writeDXF() {
	dxf.addCircle(point3d(0, 0), 10)
	// or
	const myCircle = dxf.addCircle(point3d(0, 0), 10) // If you want a reference to the added circle.

	const dxfString = dxf.stringify()
	console.log('dxf:\n', dxfString)
	writeDXFStringToFile(dxfString)
}


/**
 * The home page of the cnc web app.
 *
 * @returns {JSX.Element} The home page.
 */
export default function Home() {
	/**
	 * The width of the canvas.
	 */
	const [width, setWidth] = useState(100)
	const [proposedWidth, setProposedWidth] = useState(0)
	/**
	 * The height of the canvas.
	 */
	const [height, setHeight] = useState(100)


	return (
		<div>
			<style jsx>{`
				input, * {
					font-family: 'Space Mono', Courier, monospace;
					font-size: 2rem;
					font-weight: bold;
				}
			`}</style>
			<h1>cnc</h1>
			<InputWithUnitConversion/>
		</div>
	)
}

const InputWithUnitConversion = () => {
  const [value, setValue] = useState('');
  const [convertedValue, setConvertedValue] = useState('');

  const handleChange = (e) => {
    const inputValue = e.target.value;
		
    /**
     * Matches a number with an optional fraction or mixed number,
     * followed by an optional unit of length.
     *
     * The regex is:
     *  - `/^` start of string
     *  - `(\d*\.?\d+|` capture group 1: number with optional decimal point
     *  -     ` \d+\s\d*\/\d+|` OR space-separated mixed number
     *  -     `\d*\/\d+)` OR fraction
     *  - `\s*` any number of whitespace characters
     *  - `(in|"|ft|yd|cm|dm|m|mm)?` optional capture group 2: unit of length
     *  - `$/` end of string
     */
    const regex = /(?:^(?<value>\d*\.?\d+|\d+\s\d*\/\d+|\d*\/\d+)\s*(?<unit>in|inch|inches|"|ft|feet|'|yd|yards?|cm|dm|m|mm)?\s*$)|(?:^(?<feet>\d*\.?\d+|\d+\s\d*\/\d+|\d*\/\d+)\s*(?:ft|feet|')\s*(?<inches>\d*\.?\d+|\d+\s\d*\/\d+|\d*\/\d+)\s*(?:in|inch|inches|")?\s*$)/;
    const match = inputValue.match(regex);
    setValue(inputValue)
		
    if (match) {
			console.log('match', match)
      let {value, unit, feet, inches} = match.groups;
      let decimalValue = 0;

			if (feet && inches) {value = feet
				unit='ft'
			}
      if (value.includes(' ')) {
        const [whole, fraction] = value.split(' ');
        decimalValue += parseFloat(whole);

        if (fraction) {
          const [numerator, denominator] = fraction.split('/');
          const fractionValue = parseFloat(numerator) / parseFloat(denominator);
          decimalValue += fractionValue;
        }
      } else if (value.includes('/')) {
        const [numerator, denominator] = value.split('/');
        decimalValue += parseFloat(numerator) / parseFloat(denominator);
      } else {
        decimalValue += parseFloat(value);
      }

      let conversionFactor = 25.4; // Default to inches

      switch (unit) {
        case 'in':
        case '"':
          conversionFactor = 25.4;
          break;
        case 'ft':
          conversionFactor = 12 * 25.4;
          break;
        case 'yd':
          conversionFactor = 3 * 12 * 25.4;
          break;
        case 'cm':
          conversionFactor = 10;
          break;
        case 'dm':
          conversionFactor = 100;
          break;
        case 'm':
          conversionFactor = 1000;
          break;
        case 'mm':
          conversionFactor = 1;
          break;
        case undefined:
          conversionFactor = 1; // Assume mm if no unit provided
          break;
        // no default
      }

      const convertedValueInMm = decimalValue * conversionFactor;
			if (inches) {
				let inchDecimalValue = 0
				if (inches.includes(' ')) {
					const [whole, fraction] = inches.split(' ');
					inchDecimalValue += parseFloat(whole);
	
					if (fraction) {
						const [numerator, denominator] = fraction.split('/');
						const fractionValue = parseFloat(numerator) / parseFloat(denominator);
						inchDecimalValue += fractionValue;
					}
				} else if (inches.includes('/')) {
					const [numerator, denominator] = inches.split('/');
					inchDecimalValue += parseFloat(numerator) / parseFloat(denominator);
				} else {
					inchDecimalValue += parseFloat(inches);
				}
				setConvertedValue((convertedValueInMm + inchDecimalValue*25.4).toFixed(2))
			}
			else setConvertedValue(convertedValueInMm.toFixed(2));
      
    } else {
      setConvertedValue('');
    }
  };

  return (
    <div>
			<style jsx>{`
				input, * {
					font-family: 'Space Mono', Courier, monospace;
					font-size: 2rem;
					font-weight: bold;
				}
			`}</style>
      <input type="text" value={value} onChange={handleChange} />
      <p>Converted Value (mm): {convertedValue}</p>
    </div>
  );
};

