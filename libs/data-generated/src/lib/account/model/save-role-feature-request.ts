/**
 * Account
 * Account Api Docs
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { RoleDto } from './role-dto';
import { FeatureDto } from './feature-dto';


export interface SaveRoleFeatureRequest { 
    role?: RoleDto;
    features?: Array<FeatureDto>;
}
