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
	

function handleWidthChange() {
	if (proposedWidth) setWidth(proposedWidth)
}

	/**
	 * Handles input changes to the height input.
	 *
	 * @param {React.ChangeEvent<HTMLInputElement>} e The event.
	 */
	function handleHeightInput(e) {
		const parsedInput = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);
		if (parsedInput > 0) setHeight(parsedInput)
	}

	function handleWidthInput(e) {
		const input = e.target.value
		const match = input.match(/^(\d+(?:\.\d+)?)([a-z]*)$/i)
		if (match) {
			const value = parseFloat(match[1])
			const unit = match[2]
			let conversionFactor = 1
			switch (unit) {
				case 'in':
				case '"':
					conversionFactor = 25.4
					break
				case 'ft':
					conversionFactor = 12 * 25.4
					break
				case 'yd':
					conversionFactor = 3 * 12 * 25.4
					break
				case 'cm':
					conversionFactor = 10
					break
				case 'dm':
					conversionFactor = 100
					break
				case 'm':
					conversionFactor = 1000
					break
			}
			setWidth(value * conversionFactor)
		}
	}



	function handleWidthBlur(e) {
		
	}


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
    const regex = /^(\d*\.?\d+|\d+\s\d*\/\d+|\d*\/\d+)\s*(in|"|ft|yd|cm|dm|m|mm)?$/;
    const match = inputValue.match(regex);
		
		if (match && match[1] && !match[2]) { // if value and no unit
			// if no unit given, append with mm like an autocomplete hint
			console.log('mm')
		}
    setValue(inputValue)
		
    if (match) {
      const [, valuePart, unit] = match;
      let decimalValue = 0;

      if (valuePart.includes(' ')) {
        const [whole, fraction] = valuePart.split(' ');
        decimalValue += parseFloat(whole);

        if (fraction) {
          const [numerator, denominator] = fraction.split('/');
          const fractionValue = parseFloat(numerator) / parseFloat(denominator);
          decimalValue += fractionValue;
        }
      } else if (valuePart.includes('/')) {
        const [numerator, denominator] = valuePart.split('/');
        decimalValue += parseFloat(numerator) / parseFloat(denominator);
      } else {
        decimalValue += parseFloat(valuePart);
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
      setConvertedValue(convertedValueInMm.toFixed(2));
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

