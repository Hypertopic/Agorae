require 'spec_helper'

feature 'Verification des informations via LDAP' do

  scenario 'Verification' do
      log_in_as 'alice' 'lapinblanc'
      visit '/'
      click_on_link 'Etudiant'
      expect(page).to have_content 'Baptiste BAINIER'
      click_on_link 'Baptiste BAINIER'

      expect(page).to have_content 'baptiste.bainier@utt.fr'
      expect(page).to have_content '39582'
      expect(page).to have_content '0650250215'  
    end
end
