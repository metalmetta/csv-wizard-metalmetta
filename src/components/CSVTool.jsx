import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, Download, Upload } from 'lucide-react';

const CSVTool = () => {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const lines = content.split('\n');
      const headers = lines[0].split(',');
      const rows = lines.slice(1).map(line => line.split(','));
      setHeaders(headers);
      setData(rows);
    };
    reader.readAsText(file);
  };

  const handleCellEdit = (rowIndex, colIndex, value) => {
    const newData = [...data];
    newData[rowIndex][colIndex] = value;
    setData(newData);
  };

  const addRow = () => {
    const newRow = new Array(headers.length).fill('');
    setData([...data, newRow]);
  };

  const deleteRow = (index) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  const downloadCSV = () => {
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'edited_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gradient-to-r from-gradient-start to-gradient-end min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-white">CSV Tool</h1>
      <div className="mb-4">
        <Input type="file" accept=".csv" onChange={handleFileUpload} className="mb-2 bg-white" />
        <Button onClick={addRow} className="mr-2 bg-white text-gradient-start hover:bg-gradient-start hover:text-white"><Plus className="mr-2 h-4 w-4" /> Add Row</Button>
        <Button onClick={downloadCSV} className="bg-white text-gradient-end hover:bg-gradient-end hover:text-white"><Download className="mr-2 h-4 w-4" /> Download CSV</Button>
      </div>
      {headers.length > 0 && (
        <Table className="bg-white bg-opacity-90 rounded-lg overflow-hidden">
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gradient-start to-gradient-end">
              {headers.map((header, index) => (
                <TableHead key={index} className="text-white">{header}</TableHead>
              ))}
              <TableHead className="text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex} className="hover:bg-gray-100">
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Input
                      value={cell}
                      onChange={(e) => handleCellEdit(rowIndex, cellIndex, e.target.value)}
                      className="w-full"
                    />
                  </TableCell>
                ))}
                <TableCell>
                  <Button variant="destructive" onClick={() => deleteRow(rowIndex)} className="bg-red-500 hover:bg-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default CSVTool;
