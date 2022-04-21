import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppConfig } from '@core/interface/config.interface';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  configs: AppConfig;
  onAppConfigChanged: BehaviorSubject<AppConfig>;

  constructor() {
    // Set the settings
    this.configs = this.defaultConfigs();

    // Create the behavior subject
    this.onAppConfigChanged = new BehaviorSubject(this.configs);
  }

  /**
   * Sets settings
   *
   * @param settings
   *    The configuration object
   *
   */
  updateConfig(configs: AppConfig) {
    // Set the settings from the given object
    this.configs = Object.assign({}, this.configs, configs);

    // Trigger the event
    this.onAppConfigChanged.next(this.configs);
  }

  /**
   * Get default settings
   *
   */
  defaultConfigs(): AppConfig {
    return {
      header: true,
      footer: true,
      headerClass: '',
    };
  }

  setDefaultConfigs() {
    this.updateConfig(this.defaultConfigs());
  }
}
