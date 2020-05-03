import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { GroupSettings } from '@zfl/models';

@Component({
  selector: 'app-group-toggle',
  templateUrl: './group-toggle.component.html',
  styleUrls: ['./group-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupToggleComponent implements OnInit {
  @Input() groupSettings: GroupSettings;

  @Output() groupChange = new EventEmitter<GroupSettings>();

  constructor() {}

  ngOnInit(): void {}

  handleGroupChange(name: 'alias' | 'algo' | 'symbol') {
    this.groupChange.emit({
      ...this.groupSettings,
      [name]: !this.groupSettings[name],
    });
  }
}
