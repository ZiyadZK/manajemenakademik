'use client'

import React from 'react';
import Select from 'react-select';

export default function AdvanceSelect({ 
    listData = [],
    defaultValue = '', 
    placeholder = '',
    required = true,
    multi = false,
    inputName = 'react-select-input'
}) {
    return (
        <div className="bg-white ">
            <Select
                name={inputName}
                isClearable
                isSearchable
                options={listData}
                defaultValue={defaultValue}
                placeholder={placeholder}
                required={required}
                isMulti={multi}
                styles={{
                    control: (baseStyles, state) => ({
                        ...baseStyles,
                        backgroundColor: 'inherit', // Inherit background color from parent
                        borderColor: state.isFocused ? 'inherit' : 'inherit',
                        boxShadow: state.isFocused ? '0 0 0 1px currentColor' : 'none',
                        '&:hover': {
                            borderColor: 'inherit',
                        },
                        color: 'black',
                        cursor: 'pointer'
                    }),
                    menu: (baseStyles) => ({
                        ...baseStyles,
                        backgroundColor: 'white', // Inherit background color from parent
                        color: 'black',
                        
                    }),
                    menuList: (baseStyles) => ({
                        ...baseStyles,
                        backgroundColor: 'inherit',
                        
                    }),
                    option: (baseStyles, state) => ({
                        ...baseStyles,
                        backgroundColor: state.isSelected
                            ? 'inherit'
                            : state.isFocused
                            ? 'inherit'
                            : 'inherit',
                        color: 'black',
                        '&:hover': {
                            backgroundColor: 'lightgrey',
                        },
                        cursor: 'pointer'
                    }),
                    singleValue: (baseStyles) => ({
                        ...baseStyles,
                        color: 'black',
                    }),
                    placeholder: (baseStyles) => ({
                        ...baseStyles,
                        color: 'black',
                        opacity: '50%'
                    }),
                }}
                maxMenuHeight={100}
            />
        </div>
    )
}
