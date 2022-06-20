import {NotifierModule, NotifierOptions} from "angular-notifier";
import {NgModule} from "@angular/core";

const notifierCustomOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'left',
      distance: 20
    },
    vertical: {
      position: 'top',
      distance: 100,
      gap: 20
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};


@NgModule({
  imports: [NotifierModule.withConfig(notifierCustomOptions)],
  exports: [NotifierModule]
})

export class NotificationModule{}
