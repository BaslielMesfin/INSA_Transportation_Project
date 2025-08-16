import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, LayerGroup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom bus icon
const busIcon = new Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/344/344439.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

// Custom hook for real-time bus data simulation
const useRealTimeBusData = (initialBuses) => {
  const [buses, setBuses] = useState(initialBuses);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshData = useCallback(() => {
    setIsRefreshing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setBuses(prevBuses => 
        prevBuses.map(bus => {
          if (bus.status === 'Active') {
            // Simulate movement along route
            const currentPathIndex = bus.routePath.findIndex(
              point => point[0] === bus.currentLocation[0] && point[1] === bus.currentLocation[1]
            );
            
            if (currentPathIndex < bus.routePath.length - 1) {
              const nextPoint = bus.routePath[currentPathIndex + 1];
              const progress = 0.05; // 5% movement per update
              
              return {
                ...bus,
                currentLocation: [
                  bus.currentLocation[0] + (nextPoint[0] - bus.currentLocation[0]) * progress,
                  bus.currentLocation[1] + (nextPoint[1] - bus.currentLocation[1]) * progress
                ],
                speed: Math.max(0, Math.min(80, bus.speed + (Math.random() - 0.5) * 2)), // Random speed between 0-80 km/h
                eta: calculateETA(bus.eta, progress)
              };
            }
          }
          return bus;
        })
      );
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 500);
  }, []);

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [refreshData]);

  return { buses, lastUpdated, isRefreshing, refreshData };
};

// Helper function to calculate ETA
const calculateETA = (currentETA, progress) => {
  const etaSeconds = parseInt(currentETA);
  const reduction = Math.floor(etaSeconds * progress);
  return `${Math.max(1, etaSeconds - reduction)} mins`;
};

// Format time for display
const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Memoized Bus Marker component
const BusMarker = memo(({ bus, onClick }) => {
  const position = bus.currentLocation;
  
  return (
    <Marker 
      position={position} 
      icon={busIcon}
      eventHandlers={{ click: () => onClick(bus) }}
    >
      <Popup>
        <BusPopup bus={bus} />
      </Popup>
    </Marker>
  );
});

// Bus Popup component
const BusPopup = ({ bus }) => (
  <div className="bus-popup">
    <h3>{bus.name}</h3>
    <div className="popup-info">
      <p><span>Route:</span> {bus.route}</p>
      <p><span>Driver:</span> {bus.driver}</p>
      <p><span>Company:</span> {bus.company}</p>
      <p><span>Status:</span> 
        <span className={`status-badge ${bus.status.toLowerCase()}`}>
          {bus.status}
        </span>
      </p>
      <p><span>Speed:</span> {bus.speed} km/h</p>
      <p><span>Next Stop:</span> {bus.nextStop}</p>
      <p><span>ETA:</span> {bus.eta}</p>
    </div>
  </div>
);

// Memoized Bus Card component
const BusCard = memo(({ bus, isSelected, onClick }) => {
  return (
    <div 
      className={`bus-card ${isSelected ? 'selected' : ''} ${bus.status === 'Active' ? '' : 'inactive'}`}
      onClick={() => onClick(bus)}
    >
      <div className="card-header">
        <h3>{bus.name}</h3>
        <span className={`status-badge ${bus.status.toLowerCase()}`}>
          {bus.status}
        </span>
      </div>
      <div className="bus-info">
        <InfoRow label="Route" value={bus.route} />
        <InfoRow label="Driver" value={bus.driver} />
        <InfoRow label="Company" value={bus.company} />
        <InfoRow label="Speed" value={`${bus.speed} km/h`} />
        <InfoRow label="Next Stop" value={bus.nextStop} />
        <InfoRow label="ETA" value={bus.eta} />
      </div>
      <div className="bus-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${bus.routeProgress || 0}%` }}
          ></div>
        </div>
        <span>Route Progress</span>
      </div>
    </div>
  );
});

// Reusable info row component
const InfoRow = ({ label, value }) => (
  <p>
    <span className="info-label">{label}:</span>
    <span className="info-value">{value}</span>
  </p>
);

// Map Error Boundary
class MapErrorBoundary extends React.Component {
  state = { hasError: false };
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Map error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="map-error">
          <h3>Map Error</h3>
          <p>Unable to load the map. Please try refreshing the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Connection Status Component
const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return (
    <div className={`connection-status ${isOnline ? 'online' : 'offline'}`}>
      <span className={`status-dot ${isOnline ? 'online' : 'offline'}`}></span>
      <span>{isOnline ? 'Connected' : 'Offline'}</span>
    </div>
  );
};

// Map Controls Component
const MapControls = ({ mapRef }) => {
  const zoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };
  
  const zoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };
  
  const resetView = () => {
    if (mapRef.current) {
      mapRef.current.setView([40.7128, -74.0060], 13);
    }
  };
  
  return (
    <div className="map-controls">
      <button onClick={zoomIn} className="map-control-btn" aria-label="Zoom in">+</button>
      <button onClick={zoomOut} className="map-control-btn" aria-label="Zoom out">-</button>
      <button onClick={resetView} className="map-control-btn" aria-label="Reset view">
        <span className="reset-icon">⟲</span>
      </button>
    </div>
  );
};

// Map Legend Component
const MapLegend = () => (
  <div className="map-legend">
    <h4>Legend</h4>
    <div className="legend-item">
      <div className="legend-color active"></div>
      <span>Active Bus</span>
    </div>
    <div className="legend-item">
      <div className="legend-color maintenance"></div>
      <span>Maintenance</span>
    </div>
    <div className="legend-item">
      <div className="legend-color inactive"></div>
      <span>Inactive</span>
    </div>
  </div>
);

// Bus Search Component
const BusSearch = ({ buses, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      onSearch(buses);
      return;
    }
    
    const filteredBuses = buses.filter(bus =>
      bus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bus.driver.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    onSearch(filteredBuses);
  }, [searchTerm, buses, onSearch]);
  
  return (
    <div className="bus-search">
      <input
        type="text"
        placeholder="Search buses..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search buses"
      />
    </div>
  );
};

// Bus Filters Component
const BusFilters = ({ onFilter }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  
  const handleFilterChange = (status) => {
    setStatusFilter(status);
    onFilter(status);
  };
  
  return (
    <div className="bus-filters">
      <button 
        className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
        onClick={() => handleFilterChange('all')}
      >
        All Buses
      </button>
      <button 
        className={`filter-btn ${statusFilter === 'active' ? 'active' : ''}`}
        onClick={() => handleFilterChange('active')}
      >
        Active
      </button>
      <button 
        className={`filter-btn ${statusFilter === 'maintenance' ? 'active' : ''}`}
        onClick={() => handleFilterChange('maintenance')}
      >
        Maintenance
      </button>
    </div>
  );
};

// Empty State Component
const EmptyState = ({ message, onReset }) => (
  <div className="empty-state">
    <div className="empty-icon">🚌</div>
    <h3>No Buses Found</h3>
    <p>{message}</p>
    <button onClick={onReset} className="reset-btn">
      Reset Filters
    </button>
  </div>
);

// Main BusTracking Component
function BusTracking({ companies, buses: initialBuses }) {
  const mapRef = useRef(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [center, setCenter] = useState([40.7128, -74.0060]);
  const [filteredBuses, setFilteredBuses] = useState(initialBuses);
  const [displayedBuses, setDisplayedBuses] = useState(initialBuses);
  
  // Use real-time bus data hook
  const { buses, lastUpdated, isRefreshing, refreshData } = useRealTimeBusData(initialBuses);
  
  // Filter buses when selected company changes
  useEffect(() => {
    if (selectedCompany) {
      const filtered = buses.filter(bus => bus.company === selectedCompany);
      setFilteredBuses(filtered);
      // Reset selected bus if it's not in the filtered list
      if (selectedBus && !filtered.some(bus => bus.id === selectedBus.id)) {
        setSelectedBus(null);
      }
    } else {
      setFilteredBuses(buses);
    }
  }, [selectedCompany, buses, selectedBus]);
  
  // Handle bus selection
  const handleBusSelect = useCallback((bus) => {
    setSelectedBus(bus);
    setCenter(bus.currentLocation);
  }, []);
  
  // Handle company change
  const handleCompanyChange = useCallback((e) => {
    setSelectedCompany(e.target.value);
  }, []);
  
  // Handle search
  const handleSearch = useCallback((searchResults) => {
    setDisplayedBuses(searchResults);
  }, []);
  
  // Handle filter
  const handleFilter = useCallback((status) => {
    if (status === 'all') {
      setDisplayedBuses(filteredBuses);
    } else {
      const filtered = filteredBuses.filter(bus => bus.status.toLowerCase() === status);
      setDisplayedBuses(filtered);
    }
  }, [filteredBuses]);
  
  // Reset filters
  const resetFilters = useCallback(() => {
    setSelectedCompany('');
    setDisplayedBuses(filteredBuses);
  }, [filteredBuses]);
  
  // Get active companies (those with registrationStatus 'Completed')
  const activeCompanies = companies.filter(company => 
    company.registrationStatus === 'Completed' && company.status === 'Active'
  );
  
  return (
    <div className="bus-tracking-container">
      <div className="tracking-header">
        <h1>Real-time Bus Tracking</h1>
        
        <div className="company-selector">
          <div className="selector-label">
            <label htmlFor="company-select">Select Company:</label>
          </div>
          <div className="selector-control">
            <select 
              id="company-select" 
              value={selectedCompany} 
              onChange={handleCompanyChange}
              className="company-dropdown"
            >
              <option value="">All Companies</option>
              {activeCompanies.map(company => (
                <option key={company.id} value={company.name}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="tracking-controls">
        <BusSearch buses={filteredBuses} onSearch={handleSearch} />
        <BusFilters onFilter={handleFilter} />
        
        <div className="real-time-indicator">
          <div className="pulse-dot"></div>
          <span>Live</span>
          <span className="last-updated">
            Updated: {formatTime(lastUpdated)}
          </span>
          <button 
            className="refresh-btn" 
            onClick={refreshData}
            disabled={isRefreshing}
            aria-label="Refresh bus data"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        
        <ConnectionStatus />
      </div>
      
      <div className="tracking-content">
        <div className="map-container">
          <MapErrorBoundary>
            <MapContainer 
              center={center} 
              zoom={13} 
              style={{ height: '600px', width: '100%' }}
              whenCreated={map => { mapRef.current = map; }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <LayerGroup>
                {displayedBuses.map(bus => (
                  <React.Fragment key={bus.id}>
                    <BusMarker bus={bus} onClick={handleBusSelect} />
                    <Polyline 
                      positions={bus.routePath} 
                      color={bus.status === 'Active' ? '#3498db' : '#e74c3c'} 
                    />
                  </React.Fragment>
                ))}
              </LayerGroup>
            </MapContainer>
          </MapErrorBoundary>
          
          <MapControls mapRef={mapRef} />
          <MapLegend />
        </div>
        
        <div className="bus-list">
          <div className="list-header">
            <h2>Active Buses</h2>
            {selectedCompany && (
              <div className="company-filter">
                <span className="filter-label">Filtered by:</span>
                <span className="filter-value">{selectedCompany}</span>
                <button 
                  className="clear-filter" 
                  onClick={() => setSelectedCompany('')}
                >
                  Clear
                </button>
              </div>
            )}
          </div>
          
          <div className="bus-cards">
            {displayedBuses.length > 0 ? (
              displayedBuses.map(bus => (
                <BusCard 
                  key={bus.id} 
                  bus={bus} 
                  isSelected={selectedBus?.id === bus.id}
                  onClick={handleBusSelect}
                />
              ))
            ) : (
              <EmptyState 
                message={
                  selectedCompany 
                    ? `No buses are currently operating for ${selectedCompany}.` 
                    : 'No buses match your search criteria.'
                }
                onReset={resetFilters}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusTracking;