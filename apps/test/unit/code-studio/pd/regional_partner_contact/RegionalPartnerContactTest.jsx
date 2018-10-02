import React from 'react';
import {mount} from 'enzyme';
import {expect} from '../../../../util/configuredChai';
import RegionalPartnerContact from '@cdo/apps/code-studio/pd/regional_partner_contact/RegionalPartnerContact';

describe('RegionalPartnerContactTest', () => {
  const API_ENDPOINT = "/api/v1/pd/regional_partner_contacts";
  const OPTIONS = {
    title: ['Mr.', 'Mrs.', 'Ms.', 'Dr.'],
    role: ['Teacher', 'School Administrator', 'District Administrator'],
    gradeLevels: ['High School', 'Middle School', 'Elementary School'],
    optIn: ['Yes', 'No']
  };

  it('Job Title is optional', () => {
    const wrapper = mount(
      <RegionalPartnerContact
        apiEndpoint={API_ENDPOINT}
        options={OPTIONS}
      />
    );

    const fieldGroup = wrapper.find('FieldGroup').filterWhere(c => c.prop('id') === 'jobTitle');
    expect(fieldGroup).to.have.prop('required', false);
  });
});
