export * from './feature.service';
import { FeatureService } from './feature.service';
export * from './profile.service';
import { ProfileService } from './profile.service';
export * from './role.service';
import { RoleService } from './role.service';
export const APIS = [FeatureService, ProfileService, RoleService];
