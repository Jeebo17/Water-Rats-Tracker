import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  PoundSterling, 
  TrendingUp, 
  TrendingDown, 
  Plus,
  Filter,
  Calendar
} from 'lucide-react';
import { FinancialRecord } from '../types';

const Finances: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredRecords = financialRecords.filter(record => {
    const matchesType = filter === 'all' || record.type === filter;
    const matchesCategory = categoryFilter === 'all' || record.category === categoryFilter;
    return matchesType && matchesCategory;
  });

  const totalIncome = financialRecords
    .filter(record => record.type === 'income')
    .reduce((sum, record) => sum + record.amount, 0);

  const totalExpenses = financialRecords
    .filter(record => record.type === 'expense')
    .reduce((sum, record) => sum + record.amount, 0);

  const balance = totalIncome - totalExpenses;

  const categories = ['all', ...new Set(financialRecords.map(record => record.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Finances</h1>
          <p className="text-gray-600">Track session costs and payments</p>
        </div>
        <button className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-lg font-medium">
          <Plus className="w-4 h-4" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Income</p>
              <p className="text-3xl font-bold text-green-600">£{totalIncome}</p>
            </div>
            <div className="bg-green-500 text-white p-3 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Expenses</p>
              <p className="text-3xl font-bold text-red-600">£{totalExpenses}</p>
            </div>
            <div className="bg-red-500 text-white p-3 rounded-lg">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Balance</p>
              <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                £{Math.abs(balance)}
              </p>
              {balance < 0 && <p className="text-sm text-red-600">Deficit</p>}
            </div>
            <div className={`${balance >= 0 ? 'bg-green-500' : 'bg-red-500'} text-white p-3 rounded-lg`}>
              <PoundSterling className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Transactions</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 text-sm">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map(record => (
                <FinancialRow key={record.id} record={record} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <PoundSterling className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No transactions found</h3>
          <p className="text-gray-600">Try adjusting your filters or add a new transaction.</p>
        </div>
      )}
    </div>
  );
};

interface FinancialRowProps {
  record: FinancialRecord;
}

const FinancialRow: React.FC<FinancialRowProps> = ({ record }) => {
  const destination = record.location 
    ? destinations.find(d => d.id === record.location)
    : null;

  const typeConfig = {
    income: { color: 'bg-green-100 text-green-800', sign: '+' },
    expense: { color: 'bg-red-100 text-red-800', sign: '-' }
  };

  const categoryConfig = {
    venue: { color: 'bg-blue-100 text-blue-800' },
    equipment: { color: 'bg-purple-100 text-purple-800' },
    session_fees: { color: 'bg-green-100 text-green-800' },
    insurance: { color: 'bg-yellow-100 text-yellow-800' },
    other: { color: 'bg-gray-100 text-gray-800' }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-900">
            {format(new Date(record.date), 'MMM d, yyyy')}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-900">{record.description}</div>
        {destination && (
          <div className="text-xs text-gray-500">{destination.name}</div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryConfig[record.category].color}`}>
          {record.category}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${typeConfig[record.type].color}`}>
          {record.type}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <span className={`text-sm font-medium ${
          record.type === 'income' ? 'text-green-600' : 'text-red-600'
        }`}>
          {typeConfig[record.type].sign}£{record.amount}
        </span>
      </td>
    </tr>
  );
};

export default Finances;