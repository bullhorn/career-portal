import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { JobBoardPost } from '@bullhorn/bullhorn-types';
import { SettingsService } from 'src/app/services/settings/settings.service';

@Component({
  selector: 'app-info-chips',
  templateUrl: './info-chips.component.html',
  styleUrls: ['./info-chips.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoChipsComponent {
  @Input() public job: JobBoardPost;
  public jobInfoChips: [string|any]  = SettingsService.settings.service.jobInfoChips;

  constructor() {}

}
