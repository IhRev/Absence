import { inject, Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { MemberDTO } from '../../organizations/models/organizations.models';

@Pipe({
  name: 'membername',
  standalone: true,
})
export class MemberNameTransformPipe implements PipeTransform {
  readonly #authService = inject(AuthService);

  transform(member: MemberDTO) {
    return member.id === this.#authService.userDetails()!.id
      ? 'Me'
      : member.fullName;
  }
}
