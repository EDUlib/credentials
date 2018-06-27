from bok_choy.web_app_test import WebAppTest
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from acceptance_tests.mixins import CredentialsApiMixin, LoginMixin
from acceptance_tests.pages import CredentialsProgramRecordPage, CredentialsRecordsPage


class RecordsTests(LoginMixin, WebAppTest, CredentialsApiMixin):

    def setUp(self):
        super(RecordsTests, self).setUp()

    def test_share_flow(self):
        """Go through Records workflow."""
        self.login_with_lms()

        my_records = CredentialsRecordsPage(self.browser)
        self.assertTrue(my_records.is_browser_on_page())
        my_records.a11y_audit.check_for_accessibility_errors()

        my_records.go_to_program_record()

        program_record = CredentialsProgramRecordPage(self.browser)
        self.assertTrue(program_record.is_browser_on_page())
        program_record.a11y_audit.check_for_accessibility_errors()
