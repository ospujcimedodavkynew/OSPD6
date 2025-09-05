
// FIX: Using Gemini API to extract info from driver's license
import React, { useState, useEffect } from 'react';
import { RentalRequest, Customer } from '../types';
import { Button, Modal } from './ui';
import CustomerDetailsForm from './CustomerDetailsForm';
import { GoogleGenAI, Type } from "@google/genai";

interface RequestApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    rentalRequest: RentalRequest;
    onApprove: (request: RentalRequest) => void;
    onReject: (request: RentalRequest) => void;
}

const RequestApprovalModal: React.FC<RequestApprovalModalProps> = ({ isOpen, onClose, rentalRequest, onApprove, onReject }) => {
    const [customerDetails, setCustomerDetails] = useState(rentalRequest.customer_details);
    const [isExtracting, setIsExtracting] = useState(false);

    useEffect(() => {
        setCustomerDetails(rentalRequest.customer_details);
    }, [rentalRequest]);

    const handleCustomerChange = (field: keyof typeof customerDetails, value: string) => {
        setCustomerDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleExtract = async () => {
        if (!rentalRequest.drivers_license_image_base64) {
            alert("Není k dispozici žádný obrázek řidičského průkazu.");
            return;
        }

        if (!process.env.API_KEY) {
            alert("API klíč pro Gemini není nakonfigurován.");
            return;
        }

        setIsExtracting(true);
        try {
            // FIX: Initialize GoogleGenAI with named apiKey parameter
            const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
            
            const mimeType = rentalRequest.drivers_license_image_base64.substring("data:".length, rentalRequest.drivers_license_image_base64.indexOf(";base64"));
            const base64Data = rentalRequest.drivers_license_image_base64.split(',')[1];

            const imagePart = {
                inlineData: {
                    mimeType,
                    data: base64Data,
                },
            };

            const textPart = {
                text: "Extract the first name, last name, and driver's license number from this image. Respond in JSON format.",
            };
            
            // FIX: Use gemini-2.5-flash model and correct API call structure
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: { parts: [imagePart, textPart] },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            firstName: { type: Type.STRING },
                            lastName: { type: Type.STRING },
                            licenseNumber: { type: Type.STRING },
                        }
                    }
                }
            });
            
            // FIX: Correctly access the response text
            const text = response.text;
            const parsed = JSON.parse(text);
            
            setCustomerDetails(prev => ({
                ...prev,
                first_name: parsed.firstName || prev.first_name,
                last_name: parsed.lastName || prev.last_name,
                drivers_license_number: parsed.licenseNumber || prev.drivers_license_number
            }));

        } catch (error) {
            console.error("Chyba při extrakci dat s Gemini:", error);
            alert("Nepodařilo se extrahovat data. Zkontrolujte prosím konzoli pro více detailů.");
        } finally {
            setIsExtracting(false);
        }
    };
    
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Schválení žádosti" className="max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-bold text-lg mb-2">Nahraný řidičský průkaz</h3>
                    {rentalRequest.drivers_license_image_base64 ? (
                        <img src={rentalRequest.drivers_license_image_base64} alt="Řidičský průkaz" className="rounded max-h-60" />
                    ) : (
                        <p>Obrázek nebyl nahrán.</p>
                    )}
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-2">Údaje o zákazníkovi</h3>
                    <CustomerDetailsForm customer={customerDetails} onCustomerChange={handleCustomerChange} />
                    {rentalRequest.drivers_license_image_base64 && (
                        <Button onClick={handleExtract} disabled={isExtracting} className="mt-4">
                            {isExtracting ? "Extrahuji..." : "Extrahovat údaje pomocí AI"}
                        </Button>
                    )}
                </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
                <Button onClick={() => onReject(rentalRequest)} className="bg-red-600 hover:bg-red-700">Zamítnout</Button>
                <Button onClick={() => onApprove({ ...rentalRequest, customer_details: customerDetails })}>Schválit</Button>
            </div>
        </Modal>
    );
};

export default RequestApprovalModal;
