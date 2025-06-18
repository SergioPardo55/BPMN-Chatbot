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
            <div className="details-header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {details.customIconUrl && (
                    <img
                        src={details.customIconUrl}
                        alt={details.customType || details.name || 'Appian Icon'}
                        className="details-icon"
                        style={{ width: 32, height: 32 }}
                        onError={e => (e.target.style.display = 'none')}
                    />
                )}
                <span style={{ fontWeight: 'bold', fontSize: '1.1em' }}>{details.name}</span>
            </div>
            {details.documentationUrl && (
                <p style={{ marginTop: 10 }}>
                    <a
                        href={details.documentationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View Appian Documentation
                    </a>
                </p>
            )}
            {details.explanation && (
                <div className="element-explanation" style={{ marginTop: 16 }}>
                    <h4>Explanation</h4>
                    <div>{details.explanation}</div>
                </div>
            )}
        </div>
    );
};

export default AppianElementDetailsPanel;
