from sqlalchemy import types
from datetime import datetime, timezone

class UTCDateTime(types.TypeDecorator):

    impl = types.DateTime

    def process_bind_param(self, value, engine):
        if value is None:
            return
        if value.utcoffset() is None:
            raise ValueError(
                'Got naive datetime while timezone-aware is expected'
            )
        return value.astimezone(timezone.utc)

    def process_result_value(self, value, engine):
        if value is not None:
            return value.replace(tzinfo=timezone.utc)
