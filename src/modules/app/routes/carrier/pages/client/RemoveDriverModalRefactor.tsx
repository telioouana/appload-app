'use client';

import { useState } from 'react';
import { X, User, AlertTriangle, Trash2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface Driver {
  id: string;
  name: string;
  email: string;
  assignedTruck?: string;
}

interface RemoveDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  drivers: Driver[];
  onRemove: (driverIds: string[]) => void;
}

export function RemoveDriverModal({ isOpen, onClose, drivers, onRemove }: RemoveDriverModalProps) {
  const { language } = useLanguage();
  const [selectedDriverIds, setSelectedDriverIds] = useState<string[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const content = {
    en: {
      title: 'Remove Drivers',
      subtitle: 'Select drivers to remove from your fleet',
      selectAll: 'Select All',
      continue: 'Continue',
      cancel: 'Cancel',
      confirmTitle: 'Confirm Removal',
      confirmMessage: 'Are you sure you want to remove the following',
      driver: 'driver',
      drivers: 'drivers',
      fromFleet: 'from your fleet? This action cannot be undone.',
      confirmRemove: 'Yes, Remove',
      selected: 'selected',
      goBack: 'Go Back',
      noSelected: 'No drivers selected',
      deselectAll: 'Deselect All',
      toBeRemoved: 'Drivers to be removed:',
      youAreAbout: 'You are about to remove',
      noTruckAssigned: 'No truck assigned'
    },
    pt: {
      title: 'Remover Motoristas',
      subtitle: 'Selecione motoristas para remover da sua frota',
      selectAll: 'Selecionar Todos',
      continue: 'Continuar',
      cancel: 'Cancelar',
      confirmTitle: 'Confirmar Remoção',
      confirmMessage: 'Tem certeza de que deseja remover o seguinte',
      driver: 'motorista',
      drivers: 'motoristas',
      fromFleet: 'da sua frota? Esta ação não pode ser desfeita.',
      confirmRemove: 'Sim, Remover',
      selected: 'selecionado',
      goBack: 'Voltar',
      noSelected: 'Nenhum motorista selecionado',
      deselectAll: 'Desmarcar Todos',
      toBeRemoved: 'Motoristas a serem removidos:',
      youAreAbout: 'Você está prestes a remover',
      noTruckAssigned: 'Nenhum camião atribuído'
    }
  };

  const t = content[language];

  if (!isOpen) return null;

  const handleToggleDriver = (driverId: string) => {
    setSelectedDriverIds(prev =>
      prev.includes(driverId)
        ? prev.filter(id => id !== driverId)
        : [...prev, driverId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDriverIds.length === drivers.length) {
      setSelectedDriverIds([]);
    } else {
      setSelectedDriverIds(drivers.map(d => d.id));
    }
  };

  const handleContinue = () => {
    if (selectedDriverIds.length > 0) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmRemove = () => {
    onRemove(selectedDriverIds);
    setSelectedDriverIds([]);
    setShowConfirmation(false);
    onClose();
  };

  const handleCancel = () => {
    setSelectedDriverIds([]);
    setShowConfirmation(false);
    onClose();
  };

  const selectedDrivers = drivers.filter(d => selectedDriverIds.includes(d.id));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {!showConfirmation ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.subtitle}</p>
                </div>
              </div>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Selection Info */}
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedDriverIds.length > 0
                    ? `${selectedDriverIds.length} ${t.selected}${selectedDriverIds.length !== 1 ? 's' : ''}`
                    : t.noSelected}
                </p>
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-[#ff5722] hover:text-[#f4511e] font-medium"
                >
                  {selectedDriverIds.length === drivers.length ? t.deselectAll : t.selectAll}
                </button>
              </div>
            </div>

            {/* Drivers List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
                {drivers.map((driver) => (
                  <label
                    key={driver.id}
                    className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDriverIds.includes(driver.id)}
                      onChange={() => handleToggleDriver(driver.id)}
                      className="w-4 h-4 text-[#ff5722] border-gray-300 rounded focus:ring-[#ff5722] focus:ring-offset-0"
                    />
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff5722]/10 to-[#ff8a65]/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-[#ff5722]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{driver.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{driver.email}</p>
                      {driver.assignedTruck && (
                        <p className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">
                          Currently assigned to {driver.assignedTruck}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleContinue}
                disabled={selectedDriverIds.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.continue}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Confirmation Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t.confirmTitle}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t.confirmMessage}</p>
                </div>
              </div>
              <button
                onClick={() => setShowConfirmation(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Confirmation Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {t.youAreAbout}{' '}
                  <strong>
                    {selectedDriverIds.length} {selectedDriverIds.length !== 1 ? t.drivers : t.driver}
                  </strong>{' '}
                  {t.fromFleet}.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">{t.toBeRemoved}</p>
                {selectedDrivers.map((driver) => (
                  <div
                    key={driver.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff5722]/10 to-[#ff8a65]/10 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-[#ff5722]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{driver.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{driver.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Confirmation Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {t.goBack}
              </button>
              <button
                onClick={handleConfirmRemove}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {t.confirmRemove}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
