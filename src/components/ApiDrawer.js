import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ApiDrawer = ({ isOpen, blockData, closeDrawer, updateBlock }) => {
  const [endpoint, setEndpoint] = useState('');
  const [requestType, setRequestType] = useState('GET');
  const [headers, setHeaders] = useState([]);
  const [jsonPayload, setJsonPayload] = useState('');

  useEffect(() => {
    if (blockData) {
      setEndpoint(blockData.endpoint || '');
      setRequestType(blockData.requestType || 'GET');
      setHeaders(blockData.headers || []);
      setJsonPayload(blockData.jsonPayload || '');
    }
  }, [blockData]);

  const handleSave = () => {
    updateBlock({ endpoint, requestType, headers, jsonPayload });
    closeDrawer();
  };

  const handleAddHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const handleHeaderChange = (index, field, value) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index][field] = value;
    setHeaders(updatedHeaders);
  };

  const handleRemoveHeader = (index) => {
    const updatedHeaders = headers.filter((_, i) => i !== index);
    setHeaders(updatedHeaders);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-16 right-0 h-[calc(100%-4rem)] w-96 bg-white shadow-lg p-4 z-50 border-l border-gray-300"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">Edit API Block</h2>
            <button className="btn btn-error text-white btn-sm" onClick={closeDrawer}>
              Close
            </button>
          </div>

          {/* API Endpoint */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Endpoint URL</span>
            </label>
            <input
              type="text"
              placeholder="Enter API endpoint"
              className="input input-bordered"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
            />
          </div>

          {/* Request Type */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Request Type</span>
            </label>
            <select
              className="select select-bordered"
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
            </select>
          </div>

          {/* Headers */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Headers</span>
            </label>
            <div className="space-y-2">
              {headers.map((header, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Key"
                    className="input input-bordered w-1/2"
                    value={header.key}
                    onChange={(e) =>
                      handleHeaderChange(index, 'key', e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    className="input input-bordered w-1/2"
                    value={header.value}
                    onChange={(e) =>
                      handleHeaderChange(index, 'value', e.target.value)
                    }
                  />
                  <button
                    className="btn btn-sm btn-error text-white"
                    onClick={() => handleRemoveHeader(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                className="btn btn-sm text-white btn-primary mt-2"
                onClick={handleAddHeader}
              >
                Add Header
              </button>
            </div>
          </div>

          {/* JSON Payload (visible only for POST) */}
          {requestType === 'POST' && (
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">JSON Payload</span>
              </label>
              <textarea
                placeholder="Enter JSON payload"
                className="textarea textarea-bordered"
                rows="5"
                value={jsonPayload}
                onChange={(e) => setJsonPayload(e.target.value)}
              ></textarea>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-4">
            <button className="btn btn-primary text-white w-full" onClick={handleSave}>
              Save
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ApiDrawer;
