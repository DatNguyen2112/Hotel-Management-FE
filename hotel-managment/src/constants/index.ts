/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {faUser, faBed, faMoneyBill, faChartSimple} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import * as XLSX from 'xlsx';

export const optionListRoutes = [
    {icon: faUser, name: 'Quản lý khách hàng', to: "users"},
    {icon: faBed, name: 'Quản lý phòng', to: 'rooms'},
    {icon: faBed, name: 'Quản lý dịch vụ', to: 'services'},
    {icon: faMoneyBill, name: 'Quản lý đơn đặt phòng', to: 'room-orders'},
    {icon: faChartSimple, name: 'Thống kê', to: 'analytics'},
   
]

export const selectStyles = {
	control: (styles: any, { isFocused }: { isFocused: boolean }) => {
		return {
			...styles,
			border: isFocused ? '#4945ff 1px solid' : '1px solid #dcdce4',
			boxShadow: isFocused ? '#4945ff 0px 0px 0px 2px' : 'none',
			fontSize: '14px !important',
			lineHeight: '1.5',
			minHeight: '40px !important',
			'&:hover': {
				// k xóa
			},
		};
	},
	option: (styles: any, { isSelected }: { isSelected: boolean }) => {
		return {
			...styles,
			'&:hover': {
				backgroundColor: isSelected ? '#4945ff' : '#f0f0ff',
			},
			backgroundColor: isSelected ? '#4945ff' : '#fff',
		};
	},
	multiValue: (styles:any) => {
		return {
			...styles,
			backgroundColor: '#f0f0ff',
			color: '#4945ff',
			borderColor: '#d9d8ff',
			paddingRight: '5px',
			paddingLeft: '5px',
			borderRadius: '4px',
			borderWidth: '1px',
			border: '1px solid #ccc'
		}
	},
	multiValueLabel:  (styles:any) => {
		return  {
			...styles,
			color: '#4945ff',
			fontSize: '14px !important',
		}
	}
};


export const handleExportExcel = async (fileName?: string, filterValue?: any,  API_EXPORT_EXCEL?: any) => {
	try {
		const response = await axios.get(API_EXPORT_EXCEL, {
        responseType: 'arraybuffer',
        params: {
          fileName,
		  filter : filterValue
        } 
      });

	  const dataFormat = 'arraybuffer';

	  if (dataFormat === 'arraybuffer') {
        const workbook = XLSX.read(response.data, { type: 'array' });
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
      } else if (dataFormat === 'json') {
        const data = response.data.data?.items;
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
      }

	} catch (error) {
		console.error('Error:', error);
	}
}

export const handleExportExcelByDate = async (fileName?: string, checkIn?: any | null, checkOut?: any | null,  API_EXPORT_EXCEL?: any) => {
	try {
		const response = await axios.get(API_EXPORT_EXCEL, {
        responseType: 'arraybuffer',
        params: {
          fileName,
		  checkIn: checkIn,
		  checkOut: checkOut
        } 
      });

	  const dataFormat = 'arraybuffer';

	  if (dataFormat === 'arraybuffer') {
        const workbook = XLSX.read(response.data, { type: 'array' });
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
      } else if (dataFormat === 'json') {
        const data = response.data.data?.items;
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, fileName);
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
      }

	} catch (error) {
		console.error('Error:', error);
	}
}