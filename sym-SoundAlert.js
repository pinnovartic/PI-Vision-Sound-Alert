(function(PV) {
    'use strict';

    function soundAlert() {}
    PV.deriveVisualizationFromBase(soundAlert);

    var definition = {
        typeName: 'soundAlert',
        datasourceBehavior: PV.Extensibility.Enums.DatasourceBehaviors.Single,
        iconUrl: 'scripts/app/editor/symbols/ext/icons/sym-soundAlert.png',
        supportsCollections: true,
        visObjectType: soundAlert,
        getDefaultConfig: function() {
            return {
                DataShape: 'Value',
                Height: 70,
                Width: 250,
                Opacity: "1.0",
                BackgroundColor: 'none',
                TextColor: 'black',
                ShowLabel: true,
                ShowTime: false,
                ShowUnits: false,
                MinValue: 0,
                MaxValue: 1,
				Sound: "Alerta001",
				Enabled: true
            };
        },
        configTitle: 'Format Symbol Sound Alarm',
        StateVariables: ['MultistateColor']
    };
	
		soundAlert.prototype.init = function(scope, elem) {
        this.onDataUpdate = dataUpdate;
        this.onResize = symbolResize;
        this.onConfigChange = configChange;


        function dataUpdate(data) {
            if (data) {
                scope.value = data.Value;
                scope.config.Opacity = (data.Value - scope.config.MinValue) / (scope.config.MaxValue - scope.config.MinValue);
                scope.time = data.Time;
				
				var PIVision_audiopath = 'scripts/app/editor/symbols/ext/sounds/'
				var AudioPath = PIVision_audiopath.concat(scope.config.Sound,'.mp3')
                var audio = new Audio(AudioPath);
		
                var CurrentValue = data.Value
                CurrentValue = CurrentValue.replace(/,/g, '.')

                if (data.Label) {
                    scope.label = data.Label;
                }
                if (data.Units) {
                    scope.Units = data.Units;
                }
                if (parseFloat(CurrentValue) >= parseFloat(scope.config.MaxValue) || parseFloat(CurrentValue) < parseFloat(scope.config.MinValue)){
                    if (scope.config.Enabled){						
					audio.play();	
					}                    
				}
            }
        }

        function symbolResize(width, height) {
            var SymbolContainer = elem.find('.soundAlertLayout')[0];
            if (SymbolContainer) {
                SymbolContainer.style.width = width + 'px';
                SymbolContainer.style.height = height + 'px';
            }
        }

        function configChange(newConfig, oldConfig) {
            if (newConfig && oldConfig && !angular.equals(newConfig, oldConfig)) {
                if (!isNumeric(newConfig.MinValue) || !isNumeric(newConfig.MaxValue) || parseFloat(newConfig.MinValue) >= parseFloat(newConfig.MaxValue)) {
                    newConfig.MinValue = oldConfig.MinValue;
                    newConfig.MaxValue = oldConfig.MaxValue;
                }
                newConfig.TextColor = oldConfig.TextColor;
                newConfig.BackgroundColor = oldConfig.BackgroundColor;
            }
        }

        function isNumeric(n) {
            return n === '' || n === '-' || !isNaN(parseFloat(n)) && isFinite(n);
        }
    };	

    PV.symbolCatalog.register(definition);
})(window.PIVisualization);