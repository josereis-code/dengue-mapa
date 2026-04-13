/**
 * Dengue Focus Mapping - Main Application Script
 * 
 * This module handles all map interactions, form submissions, and data management
 * for the dengue focus mapping application.
 */

(function() {
    'use strict';

    // Application configuration
    const CONFIG = {
        MAP_CENTER: { lat: -23.5505, lng: -46.6333 }, // São Paulo
        MAP_ZOOM: 12,
        STORAGE_KEY: 'dengue_focos_cache',
        CACHE_DURATION: 5 * 60 * 1000 // 5 minutes
    };

    // Application state
    const state = {
        map: null,
        markers: [],
        focos: [],
        filteredFocos: [],
        isLoading: false,
        markerClusterer: null
    };

    /**
     * Main application object
     */
    window.app = {
        /**
         * Initialize the application
         */
        async init() {
            try {
                this.showLoading(true);
                await this.loadGoogleMapsScript();
                await this.initializeMap();
                await this.fetchDengueData();
                this.setupEventListeners();
                this.setDefaultDate();
            } catch (error) {
                console.error('Erro ao inicializar aplicação:', error);
                this.showMessage('Erro ao carregar o aplicativo. Por favor, recarregue a página.', 'error');
            } finally {
                this.showLoading(false);
            }
        },

        /**
         * Load Google Maps script asynchronously
         */
        loadGoogleMapsScript() {
            return new Promise((resolve, reject) => {
                if (window.google && window.google.maps) {
                    resolve();
                    return;
                }

                const apiKey = window.APP_CONFIG?.GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY';
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
                script.async = true;
                script.defer = true;
                
                script.onload = () => {
                    console.log('Google Maps API carregada com sucesso');
                    resolve();
                };
                
                script.onerror = (error) => {
                    console.error('Erro ao carregar Google Maps API:', error);
                    reject(new Error('Falha ao carregar API do Google Maps'));
                };
                
                document.head.appendChild(script);
            });
        },

        /**
         * Initialize the Google Map
         */
        async initializeMap() {
            return new Promise((resolve) => {
                // Wait for DOM to be ready
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', initMapInternal);
                } else {
                    initMapInternal();
                }

                function initMapInternal() {
                    state.map = new google.maps.Map(document.getElementById('map'), {
                        center: CONFIG.MAP_CENTER,
                        zoom: CONFIG.MAP_ZOOM,
                        mapTypeControl: true,
                        streetViewControl: false,
                        fullscreenControl: true,
                        zoomControl: true
                    });

                    // Add click listener to map for getting coordinates
                    state.map.addListener('click', (event) => {
                        const lat = event.latLng.lat();
                        const lng = event.latLng.lng();
                        document.getElementById('latitude').value = lat.toFixed(6);
                        document.getElementById('longitude').value = lng.toFixed(6);
                    });

                    console.log('Mapa inicializado com sucesso');
                    resolve();
                }
            });
        },

        /**
         * Fetch dengue data from the backend
         */
        async fetchDengueData() {
            try {
                const appsScriptUrl = window.APP_CONFIG?.APPS_SCRIPT_URL || 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
                
                const response = await fetch(appsScriptUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ acao: 'listar' })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                
                if (data.focos && Array.isArray(data.focos)) {
                    state.focos = data.focos;
                    this.renderMarkers();
                    this.updateStatistics();
                    this.showMessage(`${state.focos.length} foco(s) carregado(s) com sucesso!`, 'success');
                } else {
                    console.warn('Dados em formato inesperado:', data);
                    state.focos = [];
                    this.renderMarkers();
                }
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
                this.showMessage('Erro ao carregar dados. Verifique sua conexão ou tente novamente.', 'error');
                
                // Load sample data for demonstration
                this.loadSampleData();
            }
        },

        /**
         * Load sample data for demonstration purposes
         */
        loadSampleData() {
            const sampleData = [
                { id: 1, endereco: 'Rua Augusta, São Paulo', descricao: 'Água parada em pneus', latitude: -23.5505, longitude: -46.6333, data: '2024-01-15', status: 'active' },
                { id: 2, endereco: 'Av. Paulista, São Paulo', descricao: 'Piscina sem tratamento', latitude: -23.5615, longitude: -46.6559, data: '2024-01-14', status: 'active' },
                { id: 3, endereco: 'Rua da Consolação, São Paulo', descricao: 'Vasos de plantas', latitude: -23.5489, longitude: -46.6388, data: '2024-01-13', status: 'resolved' },
                { id: 4, endereco: 'Praça da Sé, São Paulo', descricao: 'Lixo acumulado', latitude: -23.5506, longitude: -46.6333, data: new Date().toISOString().split('T')[0], status: 'active' }
            ];
            
            state.focos = sampleData;
            this.renderMarkers();
            this.updateStatistics();
            this.showMessage('Carregando dados de demonstração...', 'info');
        },

        /**
         * Render markers on the map
         */
        renderMarkers() {
            // Clear existing markers
            this.clearMarkers();

            // Filter based on current filter
            const filter = document.getElementById('filter-status')?.value || 'all';
            state.filteredFocos = state.focos.filter(foco => {
                if (filter === 'all') return true;
                return foco.status === filter;
            });

            // Create markers for each focus
            state.filteredFocos.forEach(foco => {
                if (foco.latitude && foco.longitude) {
                    const marker = new google.maps.Marker({
                        position: { lat: parseFloat(foco.latitude), lng: parseFloat(foco.longitude) },
                        map: state.map,
                        title: foco.endereco,
                        icon: this.getMarkerIcon(foco.status)
                    });

                    // Add info window
                    const infoWindow = new google.maps.InfoWindow({
                        content: this.createInfoWindowContent(foco)
                    });

                    marker.addListener('click', () => {
                        infoWindow.open(state.map, marker);
                    });

                    marker.addListener('mouseover', () => {
                        infoWindow.open(state.map, marker);
                    });

                    state.markers.push(marker);
                }
            });

            // Update marker count
            document.getElementById('marker-count').textContent = state.markers.length;

            // Fit bounds to show all markers
            if (state.markers.length > 0) {
                const bounds = new google.maps.LatLngBounds();
                state.markers.forEach(marker => bounds.extend(marker.getPosition()));
                state.map.fitBounds(bounds);
            }
        },

        /**
         * Get marker icon based on status
         */
        getMarkerIcon(status) {
            const colors = {
                active: 'red',
                resolved: 'green'
            };
            
            return {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: colors[status] || 'blue',
                fillOpacity: 0.8,
                strokeWeight: 2,
                strokeColor: 'white'
            };
        },

        /**
         * Create info window content
         */
        createInfoWindowContent(foco) {
            const dateFormatted = new Date(foco.data).toLocaleDateString('pt-BR');
            const statusText = foco.status === 'active' ? 'Ativo' : 'Resolvido';
            const statusClass = foco.status === 'active' ? 'color: red; font-weight: bold;' : 'color: green; font-weight: bold;';
            
            return `
                <div style="padding: 10px; max-width: 250px;">
                    <h3 style="margin: 0 0 10px 0; color: #2c3e50;">${foco.endereco}</h3>
                    <p style="margin: 5px 0;"><strong>Descrição:</strong><br>${foco.descricao}</p>
                    <p style="margin: 5px 0;"><strong>Data:</strong> ${dateFormatted}</p>
                    <p style="margin: 5px 0;"><strong>Status:</strong> <span style="${statusClass}">${statusText}</span></p>
                    ${foco.foto ? `<p style="margin: 5px 0;"><a href="${foco.foto}" target="_blank" style="color: #3498db;">Ver foto</a></p>` : ''}
                </div>
            `;
        },

        /**
         * Clear all markers from the map
         */
        clearMarkers() {
            state.markers.forEach(marker => marker.setMap(null));
            state.markers = [];
        },

        /**
         * Open modal for adding new focus
         */
        openModal() {
            const modal = document.getElementById('modal-add-focus');
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Set default date if not already set
            if (!document.getElementById('data').value) {
                this.setDefaultDate();
            }
        },

        /**
         * Close modal
         */
        closeModal() {
            const modal = document.getElementById('modal-add-focus');
            modal.classList.add('hidden');
            document.body.style.overflow = '';
            this.resetForm();
        },

        /**
         * Reset form fields
         */
        resetForm() {
            const form = document.getElementById('form-add-focus');
            form.reset();
            document.getElementById('latitude').value = '';
            document.getElementById('longitude').value = '';
            this.hideError('endereco');
        },

        /**
         * Set default date to today
         */
        setDefaultDate() {
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('data').value = today;
        },

        /**
         * Geocode address to get coordinates
         */
        async geocodeAddress() {
            const endereco = document.getElementById('endereco').value.trim();
            
            if (!endereco) {
                this.showError('endereco', 'Por favor, digite um endereço primeiro.');
                return;
            }

            this.hideError('endereco');

            try {
                const geocoder = new google.maps.Geocoder();
                
                const result = await new Promise((resolve, reject) => {
                    geocoder.geocode({ address: endereco }, (results, status) => {
                        if (status === 'OK' && results[0]) {
                            resolve(results[0]);
                        } else {
                            reject(new Error('Endereço não encontrado'));
                        }
                    });
                });

                const location = result.geometry.location;
                document.getElementById('latitude').value = location.lat().toFixed(6);
                document.getElementById('longitude').value = location.lng().toFixed(6);
                
                // Center map on the location
                state.map.setCenter(location);
                state.map.setZoom(15);
                
                this.showMessage('Coordenadas obtidas com sucesso!', 'success');
            } catch (error) {
                console.error('Erro no geocoding:', error);
                this.showError('endereco', 'Não foi possível encontrar este endereço. Verifique e tente novamente.');
                this.showMessage('Erro ao obter coordenadas do endereço.', 'error');
            }
        },

        /**
         * Handle form submission
         */
        async handleSubmit(event) {
            event.preventDefault();
            
            const btnSubmit = document.getElementById('btn-submit');
            btnSubmit.classList.add('loading');

            try {
                const formData = {
                    acao: 'adicionar',
                    endereco: document.getElementById('endereco').value.trim(),
                    descricao: document.getElementById('descricao').value.trim(),
                    data: document.getElementById('data').value,
                    latitude: parseFloat(document.getElementById('latitude').value),
                    longitude: parseFloat(document.getElementById('longitude').value),
                    foto: document.getElementById('foto_url').value.trim(),
                    status: document.getElementById('status').value
                };

                // Validate required fields
                if (!formData.endereco || !formData.descricao || !formData.data) {
                    throw new Error('Preencha todos os campos obrigatórios.');
                }

                if (isNaN(formData.latitude) || isNaN(formData.longitude)) {
                    throw new Error('Coordenadas inválidas. Use o botão "Obter Coordenadas" ou insira manualmente.');
                }

                const appsScriptUrl = window.APP_CONFIG?.APPS_SCRIPT_URL || 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
                
                const response = await fetch(appsScriptUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                
                if (result.sucesso) {
                    this.showMessage('Foco cadastrado com sucesso!', 'success');
                    this.closeModal();
                    await this.fetchDengueData(); // Refresh data
                } else {
                    throw new Error(result.mensagem || 'Erro ao cadastrar foco.');
                }
            } catch (error) {
                console.error('Erro ao cadastrar foco:', error);
                this.showMessage(error.message || 'Erro ao cadastrar foco. Tente novamente.', 'error');
            } finally {
                btnSubmit.classList.remove('loading');
            }
        },

        /**
         * Refresh data from backend
         */
        async refreshData() {
            this.showLoading(true);
            await this.fetchDengueData();
            this.showLoading(false);
        },

        /**
         * Filter markers by status
         */
        filterByStatus(status) {
            this.renderMarkers();
            this.updateStatistics();
        },

        /**
         * Update statistics display
         */
        updateStatistics() {
            const total = state.focos.length;
            const active = state.focos.filter(f => f.status === 'active').length;
            const resolved = state.focos.filter(f => f.status === 'resolved').length;
            
            const today = new Date().toISOString().split('T')[0];
            const todayCount = state.focos.filter(f => f.data === today).length;

            document.getElementById('stat-total').textContent = total;
            document.getElementById('stat-active').textContent = active;
            document.getElementById('stat-resolved').textContent = resolved;
            document.getElementById('stat-today').textContent = todayCount;
        },

        /**
         * Setup event listeners
         */
        setupEventListeners() {
            // Close modal with Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeModal();
                }
            });
        },

        /**
         * Show loading indicator
         */
        showLoading(show) {
            const loading = document.getElementById('loading');
            if (show) {
                loading.classList.remove('hidden');
                state.isLoading = true;
            } else {
                loading.classList.add('hidden');
                state.isLoading = false;
            }
        },

        /**
         * Show status message
         */
        showMessage(message, type = 'info') {
            const statusEl = document.getElementById('status-message');
            statusEl.textContent = message;
            statusEl.className = `status-message ${type}`;
            statusEl.classList.remove('hidden');

            // Auto-hide after 5 seconds
            setTimeout(() => {
                statusEl.classList.add('hidden');
            }, 5000);
        },

        /**
         * Show field error
         */
        showError(fieldId, message) {
            const errorEl = document.getElementById(`${fieldId}-error`);
            if (errorEl) {
                errorEl.textContent = message;
                errorEl.classList.remove('hidden');
            }
        },

        /**
         * Hide field error
         */
        hideError(fieldId) {
            const errorEl = document.getElementById(`${fieldId}-error`);
            if (errorEl) {
                errorEl.classList.add('hidden');
            }
        }
    };

    // Initialize app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => window.app.init());
    } else {
        window.app.init();
    }
})();