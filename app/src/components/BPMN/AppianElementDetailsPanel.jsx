import React from 'react';
import './Modeler.css'; // Assuming styles will be in Modeler.css or a new dedicated CSS file

const AppianElementDetailsPanel = ({ details }) => {
    if (!details) {
        return null; // Don't render anything if no Appian element is selected
    }
    console.log("[AppianElementDetailsPanel.jsx] Received details:", details); // DEBUG
    console.log("[AppianElementDetailsPanel.jsx] Details documentationUrl:", details.documentationUrl, "Type:", typeof details.documentationUrl); // DEBUG Renamed

    return (
        <div className="appian-details-panel">
            <h4>Appian Element Details</h4>
            <div className="details-content">
                {details.customIconUrl && (
                    <img 
                        src={details.customIconUrl} 
                        alt={details.customType || 'Appian Icon'} 
                        className="details-icon"
                        onError={(e) => e.target.style.display = 'none'} // Hide if icon fails to load
                    />
                )}
                <div className="details-text">
                    <p><strong>Name:</strong> {details.name}</p>
                    <p><strong>Appian Type:</strong> {details.customType || 'N/A'}</p>
                    <p><strong>BPMN Type:</strong> {details.type}</p>
                    <p><strong>ID:</strong> {details.id}</p>
                </div>
            </div>
            {/* 
              The following block renders the documentation text if details.customType exists.
              It becomes a clickable link only if details.link is also a non-empty string.
              If details.link is empty, the text is shown but is not a link.
            */}
            {details.customType && (
                 <p>
                    {details.documentationUrl ? ( // Renamed from details.link
                        <a 
                            href={details.documentationUrl} // Renamed from details.link
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            View Appian Documentation for {details.customType}
                        </a>
                    ) : (
                        // Render just the text if no link is available
                        <>View Appian Documentation for {details.customType}</>
                    )}
                </p>
            )}
        </div>
    );
};

export default AppianElementDetailsPanel;
