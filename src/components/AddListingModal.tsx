import { useState } from 'react';
import { X, MapPin, Phone, FileText } from 'lucide-react';

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddListingModal = ({ isOpen, onClose }: AddListingModalProps) => {
  const [formData, setFormData] = useState({
    amount: '',
    location: '',
    phone: '',
    notes: '',
  });

  const locations = ['Block A', 'Block B', 'Block C', 'Library', 'Lakeview', 'Cuisine'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-primary-900">Add Listing</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-primary-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <span className="absolute left-3 top-3 text-primary-600 font-medium">₹</span>
              <input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-8 pr-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-primary-400" />
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors appearance-none"
                required
              >
                <option value="">Select Location</option>
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-primary-400" />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div className="relative">
              <FileText className="absolute left-3 top-3 h-5 w-5 text-primary-400" />
              <textarea
                placeholder="Notes (optional)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-primary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                rows={3}
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-primary-50 text-primary-700 py-3 rounded-lg hover:bg-primary-100 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                Add Listing
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddListingModal;