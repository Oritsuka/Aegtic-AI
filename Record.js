import React, { useState } from 'react';

export default function ElderlyRecordForm() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    disease: '',
    note: ''
  });

  const [records, setRecords] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // สร้าง record ใหม่พร้อม timestamp
    const newRecord = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toLocaleString('th-TH')
    };

    // เพิ่มข้อมูลเข้า array
    setRecords(prev => [...prev, newRecord]);

    // แสดงข้อความสำเร็จ
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // รีเซ็ตฟอร์ม
    setFormData({
      name: '',
      age: '',
      gender: '',
      disease: '',
      note: ''
    });
  };

  const handleDelete = (id) => {
    setRecords(prev => prev.filter(record => record.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Alert */}
        {showSuccess && (
          <div className="mb-6 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-bounce">
            <span className="text-2xl">✅</span>
            <span className="font-medium">บันทึกข้อมูลสำเร็จ!</span>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border border-green-100">
          <div className="text-center mb-6">
            <div className="inline-block p-4 bg-gradient-to-br from-green-400 to-teal-500 rounded-full mb-4">
              <span className="text-4xl">👴👵</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">เพิ่มข้อมูลผู้สูงอายุ / ผู้ป่วย</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ชื่อ - นามสกุล */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                ชื่อ - นามสกุล <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                placeholder="กรอกชื่อ-นามสกุล"
              />
            </div>

            {/* อายุ */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                อายุ <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="1"
                max="150"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                placeholder="กรอกอายุ"
              />
            </div>

            {/* เพศ */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                เพศ <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors bg-white"
              >
                <option value="">-- เลือกเพศ --</option>
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
              </select>
            </div>

            {/* โรคประจำตัว */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                โรคประจำตัว / กลุ่มโรค
              </label>
              <input
                type="text"
                name="disease"
                value={formData.disease}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors"
                placeholder="เช่น เบาหวาน, ความดัน, หัวใจ"
              />
            </div>

            {/* หมายเหตุ */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                หมายเหตุเพิ่มเติม
              </label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors resize-none"
                placeholder="กรอกหมายเหตุเพิ่มเติม (ถ้ามี)"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span className="text-xl">💾</span>
              <span>บันทึกข้อมูล</span>
            </button>
          </form>
        </div>

        {/* Records List */}
        {records.length > 0 && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span>📋</span>
              <span>รายการที่บันทึกไว้ ({records.length})</span>
            </h3>
            
            <div className="space-y-4">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-5 border border-blue-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-xl font-bold text-gray-800">{record.name}</h4>
                      <p className="text-sm text-gray-500">{record.timestamp}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-lg transition-colors"
                      title="ลบข้อมูล"
                    >
                      <span className="text-xl">🗑️</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600 font-medium">อายุ:</span>
                      <span className="ml-2 text-gray-800">{record.age} ปี</span>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">เพศ:</span>
                      <span className="ml-2 text-gray-800">{record.gender}</span>
                    </div>
                  </div>
                  
                  {record.disease && (
                    <div className="mt-3 text-sm">
                      <span className="text-gray-600 font-medium">โรคประจำตัว:</span>
                      <span className="ml-2 text-gray-800">{record.disease}</span>
                    </div>
                  )}
                  
                  {record.note && (
                    <div className="mt-3 text-sm">
                      <span className="text-gray-600 font-medium">หมายเหตุ:</span>
                      <p className="ml-2 text-gray-800 mt-1">{record.note}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}