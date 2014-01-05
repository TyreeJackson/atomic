using AtomicNet;

namespace AtomicNet
{

    using IComparable                   = System.IComparable;
    using IComparable_DateTimeOffset    = System.IComparable<DateTimeOffset>;
    using IDeserializationCallback      = System.Runtime.Serialization.IDeserializationCallback;
    using IEquatable_DateTimeOffset     = System.IEquatable<DateTimeOffset>;
    using IFormattable                  = System.IFormattable;
    using IFormatProvider               = System.IFormatProvider;
    using ISerializable                 = System.Runtime.Serialization.ISerializable;
    using Calendar                      = System.Globalization.Calendar;
    using DateTime                      = System.DateTime;
    using DateTimeStyles                = System.Globalization.DateTimeStyles;
    using DayOfWeek                     = System.DayOfWeek;
    using SecuritySafeCriticalAttribute = System.Security.SecuritySafeCriticalAttribute;
    using SerializationInfo             = System.Runtime.Serialization.SerializationInfo;
    using StreamingContext              = System.Runtime.Serialization.StreamingContext;
    using SystemDateTimeOffset          = System.DateTimeOffset;
    using TimeSpan                      = System.TimeSpan;

    public  struct  DateTimeOffset
    :
                    IComparable,
                    IDeserializationCallback,
                    IFormattable,
                    ISerializable,
                    IComparable_DateTimeOffset,
                    IEquatable_DateTimeOffset
    {

        public
        static
        readonly    DateTimeOffset          nineteenSeventyDate                             = new DateTimeOffset(1970, 1, 1, 0, 0, 0, TimeSpan.Zero);

        public
        static
        readonly    double                  nineteenSeventyEpoch                            = nineteenSeventyDate.ConvertToEpoch();

        public
        static
        readonly    double                  Day1Epoch                                       = nineteenSeventyDate.AddDays(1).ConvertToEpoch();

        private
        static      int?                    _timeShift;

        private
        static      int                     timeShift
        {
            get
            {
                if (!DateTimeOffset._timeShift.HasValue)    DateTimeOffset._timeShift   = Configuration.Config.TimeShift;
                return DateTimeOffset._timeShift.Value;
            }
        }

        private     SystemDateTimeOffset    value;

        // Summary:
        //     Represents the greatest possible value of DeltaSpace.DateTimeOffset. This field
        //     is read-only.
        //
        // Exceptions:
        //   System.ArgumentOutOfRangeException:
        //     System.DateTime.MaxValue is outside the range of the current or specified
        //     culture's default calendar.
        public
        static
        readonly    DateTimeOffset          MaxValue                                        = SystemDateTimeOffset.MaxValue;

        //
        // Summary:
        //     Represents the earliest possible DeltaSpace.DateTimeOffset value. This field
        //     is read-only.
        public
        static
        readonly    DateTimeOffset          MinValue                                        = SystemDateTimeOffset.MinValue;

        //
        // Summary:
        //     Initializes a new instance of the DeltaSpace.DateTimeOffset structure using the
        //     specified System.DateTime value.
        //
        // Parameters:
        //   dateTime:
        //     A date and time.
        //
        // Exceptions:
        //   System.ArgumentOutOfRangeException:
        //     The Coordinated Universal Time (UTC) date and time that results from applying
        //     the offset is earlier than DeltaSpace.DateTimeOffset.MinValue.-or-The UTC date
        //     and time that results from applying the offset is later than DeltaSpace.DateTimeOffset.MaxValue.
        public                              DateTimeOffset(DateTime dateTime)               { this.value = new SystemDateTimeOffset(dateTime); }

        //
        // Summary:
        //     Initializes a new instance of the DeltaSpace.DateTimeOffset structure using the
        //     specified System.DateTime value.
        //
        // Parameters:
        //   dateTime:
        //     A date and time.
        //
        // Exceptions:
        //   System.ArgumentOutOfRangeException:
        //     The Coordinated Universal Time (UTC) date and time that results from applying
        //     the offset is earlier than DeltaSpace.DateTimeOffset.MinValue.-or-The UTC date
        //     and time that results from applying the offset is later than DeltaSpace.DateTimeOffset.MaxValue.
        public                              DateTimeOffset
                                            (
                                                SystemDateTimeOffset    dateTimeOffset
                                            )                                               { this.value = dateTimeOffset; }

        //
        // Summary:
        //     Initializes a new instance of the DeltaSpace.DateTimeOffset structure using the
        //     specified System.DateTime value and offset.
        //
        // Parameters:
        //   dateTime:
        //     A date and time.
        //
        //   offset:
        //     The time's offset from Coordinated Universal Time (UTC).
        //
        // Exceptions:
        //   System.ArgumentException:
        //     dateTime.Kind equals System.DateTimeKind.Utc and offset does not equal zero.-or-dateTime.Kind
        //     equals System.DateTimeKind.Local and offset does not equal the offset of
        //     the system's local time zone.-or-offset is not specified in whole minutes.
        //
        //   System.ArgumentOutOfRangeException:
        //     offset is less than -14 hours or greater than 14 hours.-or-DeltaSpace.DateTimeOffset.UtcDateTime
        //     is less than DeltaSpace.DateTimeOffset.MinValue or greater than DeltaSpace.DateTimeOffset.MaxValue.
        public                              DateTimeOffset
                                            (
                                                DateTime    dateTime,
                                                TimeSpan    offset
                                            )                                               { this.value = new SystemDateTimeOffset(dateTime, offset); }

        //
        // Summary:
        //     Initializes a new instance of the DeltaSpace.DateTimeOffset structure using the
        //     specified number of ticks and offset.
        //
        // Parameters:
        //   ticks:
        //     A date and time expressed as the number of 100-nanosecond intervals that
        //     have elapsed since 12:00:00 midnight on January 1, 0001.
        //
        //   offset:
        //     The time's offset from Coordinated Universal Time (UTC).
        //
        // Exceptions:
        //   System.ArgumentException:
        //     offset is not specified in whole minutes.
        //
        //   System.ArgumentOutOfRangeException:
        //     The DeltaSpace.DateTimeOffset.UtcDateTime property is earlier than DeltaSpace.DateTimeOffset.MinValue
        //     or later than DeltaSpace.DateTimeOffset.MaxValue.-or-ticks is less than DateTimeOffset.MinValue.Ticks
        //     or greater than DateTimeOffset.MaxValue.Ticks.-or-Offset s less than -14
        //     hours or greater than 14 hours.
        public                              DateTimeOffset
                                            (
                                                long        ticks,
                                                TimeSpan    offset
                                            )                                               { this.value = new SystemDateTimeOffset(ticks, offset); }

        //
        // Summary:
        //     Initializes a new instance of the DeltaSpace.DateTimeOffset structure using the
        //     specified year, month, day, hour, minute, second, and offset.
        //
        // Parameters:
        //   year:
        //     The year (1 through 9999).
        //
        //   month:
        //     The month (1 through 12).
        //
        //   day:
        //     The day (1 through the number of days in month).
        //
        //   hour:
        //     The hours (0 through 23).
        //
        //   minute:
        //     The minutes (0 through 59).
        //
        //   second:
        //     The seconds (0 through 59).
        //
        //   offset:
        //     The time's offset from Coordinated Universal Time (UTC).
        //
        // Exceptions:
        //   System.ArgumentException:
        //     offset does not represent whole minutes.
        //
        //   System.ArgumentOutOfRangeException:
        //     year is less than one or greater than 9999.-or-month is less than one or
        //     greater than 12.-or-day is less than one or greater than the number of days
        //     in month.-or-hour is less than zero or greater than 23.-or-minute is less
        //     than 0 or greater than 59.-or-second is less than 0 or greater than 59.-or-offset
        //     is less than -14 hours or greater than 14 hours.-or-The DeltaSpace.DateTimeOffset.UtcDateTime
        //     property is earlier than DeltaSpace.DateTimeOffset.MinValue or later than DeltaSpace.DateTimeOffset.MaxValue.
        public                              DateTimeOffset
                                            (
                                                int         year,
                                                int         month,
                                                int         day,
                                                int         hour,
                                                int         minute,
                                                int         second,
                                                TimeSpan    offset
                                            )                                               { this.value = new SystemDateTimeOffset(year, month, day, hour, minute, second, offset); }

        //
        // Summary:
        //     Initializes a new instance of the DeltaSpace.DateTimeOffset structure using the
        //     specified year, month, day, hour, minute, second, millisecond, and offset.
        //
        // Parameters:
        //   year:
        //     The year (1 through 9999).
        //
        //   month:
        //     The month (1 through 12).
        //
        //   day:
        //     The day (1 through the number of days in month).
        //
        //   hour:
        //     The hours (0 through 23).
        //
        //   minute:
        //     The minutes (0 through 59).
        //
        //   second:
        //     The seconds (0 through 59).
        //
        //   millisecond:
        //     The milliseconds (0 through 999).
        //
        //   offset:
        //     The time's offset from Coordinated Universal Time (UTC).
        //
        // Exceptions:
        //   System.ArgumentException:
        //     offset does not represent whole minutes.
        //
        //   System.ArgumentOutOfRangeException:
        //     year is less than one or greater than 9999.-or-month is less than one or
        //     greater than 12.-or-day is less than one or greater than the number of days
        //     in month.-or-hour is less than zero or greater than 23.-or-minute is less
        //     than 0 or greater than 59.-or-second is less than 0 or greater than 59.-or-millisecond
        //     is less than 0 or greater than 999.-or-offset is less than -14 or greater
        //     than 14.-or-The DeltaSpace.DateTimeOffset.UtcDateTime property is earlier than
        //     DeltaSpace.DateTimeOffset.MinValue or later than DeltaSpace.DateTimeOffset.MaxValue.
        public                              DateTimeOffset
                                            (
                                                int         year, 
                                                int         month, 
                                                int         day, 
                                                int         hour, 
                                                int         minute, 
                                                int         second, 
                                                int         millisecond, 
                                                TimeSpan    offset
                                            )                                               { this.value = new SystemDateTimeOffset(year, month, day, hour, minute, second, millisecond, offset); }

        //
        // Summary:
        //     Initializes a new instance of the DeltaSpace.DateTimeOffset structure using the
        //     specified year, month, day, hour, minute, second, millisecond, and offset
        //     of a specified calendar.
        //
        // Parameters:
        //   year:
        //     The year.
        //
        //   month:
        //     The month (1 through 12).
        //
        //   day:
        //     The day (1 through the number of days in month).
        //
        //   hour:
        //     The hours (0 through 23).
        //
        //   minute:
        //     The minutes (0 through 59).
        //
        //   second:
        //     The seconds (0 through 59).
        //
        //   millisecond:
        //     The milliseconds (0 through 999).
        //
        //   calendar:
        //     The calendar that is used to interpret year, month, and day.
        //
        //   offset:
        //     The time's offset from Coordinated Universal Time (UTC).
        //
        // Exceptions:
        //   System.ArgumentException:
        //     offset does not represent whole minutes.
        //
        //   System.ArgumentNullException:
        //     calendar cannot be null.
        //
        //   System.ArgumentOutOfRangeException:
        //     year is less than the calendar parameter's MinSupportedDateTime.Year or greater
        //     than MaxSupportedDateTime.Year.-or-month is either less than or greater than
        //     the number of months in year in the calendar. -or-day is less than one or
        //     greater than the number of days in month.-or-hour is less than zero or greater
        //     than 23.-or-minute is less than 0 or greater than 59.-or-second is less than
        //     0 or greater than 59.-or-millisecond is less than 0 or greater than 999.-or-offset
        //     is less than -14 hours or greater than 14 hours.-or-The year, month, and
        //     day parameters cannot be represented as a date and time value.-or-The DeltaSpace.DateTimeOffset.UtcDateTime
        //     property is earlier than DeltaSpace.DateTimeOffset.MinValue or later than DeltaSpace.DateTimeOffset.MaxValue.
        public                              DateTimeOffset
                                            (
                                                int         year, 
                                                int         month, 
                                                int         day, 
                                                int         hour, 
                                                int         minute, 
                                                int         second, 
                                                int         millisecond, 
                                                Calendar    calendar, 
                                                TimeSpan    offset
                                            )                                               { this.value = new SystemDateTimeOffset(year, month, day, hour, minute, second, millisecond, calendar, offset); }

        // Summary:
        //     Subtracts one DeltaSpace.DateTimeOffset object from another and yields a time
        //     interval.
        //
        // Parameters:
        //   left:
        //     The minuend.
        //
        //   right:
        //     The subtrahend.
        //
        // Returns:
        //     An object that represents the difference between left and right.
        public
        static      TimeSpan                operator -
                                            (
                                                DateTimeOffset  left, 
                                                DateTimeOffset  right
                                            )                                               { return left.value - right.value; }

        // Summary:
        //     Subtracts one DeltaSpace.DateTimeOffset object from another and yields a time
        //     interval.
        //
        // Parameters:
        //   left:
        //     The minuend.
        //
        //   right:
        //     The subtrahend.
        //
        // Returns:
        //     An object that represents the difference between left and right.
        public
        static      TimeSpan                operator -
                                            (
                                                SystemDateTimeOffset    left,
                                                DateTimeOffset          right
                                            )                                               { return left - right.value; }

        // Summary:
        //     Subtracts one DeltaSpace.DateTimeOffset object from another and yields a time
        //     interval.
        //
        // Parameters:
        //   left:
        //     The minuend.
        //
        //   right:
        //     The subtrahend.
        //
        // Returns:
        //     An object that represents the difference between left and right.
        public
        static      TimeSpan                operator -
                                            (
                                                DateTimeOffset          left, 
                                                SystemDateTimeOffset    right
                                            )                                               { return left.value - right; }

        //
        // Summary:
        //     Subtracts a specified time interval from a specified date and time, and yields
        //     a new date and time.
        //
        // Parameters:
        //   dateTimeOffset:
        //     The date and time object to subtract from.
        //
        //   timeSpan:
        //     The time interval to subtract.
        //
        // Returns:
        //     An object that is equal to the value of dateTimeOffset minus timeSpan.
        //
        // Exceptions:
        //   System.ArgumentOutOfRangeException:
        //     The resulting DeltaSpace.DateTimeOffset value is less than DeltaSpace.DateTimeOffset.MinValue
        //     or greater than DeltaSpace.DateTimeOffset.MaxValue.
        public
        static      DateTimeOffset          operator -
                                            (
                                                DateTimeOffset  dateTimeOffset,
                                                TimeSpan        timeSpan
                                            )                                               { return dateTimeOffset.value - timeSpan; }

        //
        // Summary:
        //     Determines whether two specified DeltaSpace.DateTimeOffset objects refer to different
        //     points in time.
        //
        // Parameters:
        //   left:
        //     The first object to compare.
        //
        //   right:
        //     The second object to compare.
        //
        // Returns:
        //     true if left and right do not have the same DeltaSpace.DateTimeOffset.UtcDateTime
        //     value; otherwise, false.
        public
        static      bool                    operator !=
                                            (
                                                DateTimeOffset  left, 
                                                DateTimeOffset  right
                                            )                                               { return left.value != right.value; }

        //
        // Summary:
        //     Adds a specified time interval to a DeltaSpace.DateTimeOffset object that has
        //     a specified date and time, and yields a DeltaSpace.DateTimeOffset object that
        //     has new a date and time.
        //
        // Parameters:
        //   dateTimeOffset:
        //     The object to add the time interval to.
        //
        //   timeSpan:
        //     The time interval to add.
        //
        // Returns:
        //     An object whose value is the sum of the values of dateTimeTz and timeSpan.
        //
        // Exceptions:
        //   System.ArgumentOutOfRangeException:
        //     The resulting DeltaSpace.DateTimeOffset value is less than DeltaSpace.DateTimeOffset.MinValue.-or-
        //     The resulting DeltaSpace.DateTimeOffset value is greater than DeltaSpace.DateTimeOffset.MaxValue.
        public
        static      DateTimeOffset          operator +
                                            (
                                                DateTimeOffset  dateTimeOffset,
                                                TimeSpan        timeSpan
                                            )                                               { return dateTimeOffset.value + timeSpan; }

        //
        // Summary:
        //     Determines whether one specified DeltaSpace.DateTimeOffset object is less than
        //     a second specified DeltaSpace.DateTimeOffset object.
        //
        // Parameters:
        //   left:
        //     The first object to compare.
        //
        //   right:
        //     The second object to compare.
        //
        // Returns:
        //     true if the DeltaSpace.DateTimeOffset.UtcDateTime value of left is earlier than
        //     the DeltaSpace.DateTimeOffset.UtcDateTime value of right; otherwise, false.
        public
        static      bool                    operator <
                                            (
                                                DateTimeOffset  left, 
                                                DateTimeOffset  right
                                            )                                               { return left.value < right.value; }

        //
        // Summary:
        //     Determines whether one specified DeltaSpace.DateTimeOffset object is less than
        //     a second specified DeltaSpace.DateTimeOffset object.
        //
        // Parameters:
        //   left:
        //     The first object to compare.
        //
        //   right:
        //     The second object to compare.
        //
        // Returns:
        //     true if the DeltaSpace.DateTimeOffset.UtcDateTime value of left is earlier than
        //     the DeltaSpace.DateTimeOffset.UtcDateTime value of right; otherwise, false.
        public
        static      bool                    operator <=
                                            (
                                                DateTimeOffset  left, 
                                                DateTimeOffset  right
                                            )                                               { return left.value <= right.value; }

        //
        // Summary:
        //     Determines whether two specified DeltaSpace.DateTimeOffset objects represent
        //     the same point in time.
        //
        // Parameters:
        //   left:
        //     The first object to compare.
        //
        //   right:
        //     The second object to compare.
        //
        // Returns:
        //     true if both DeltaSpace.DateTimeOffset objects have the same DeltaSpace.DateTimeOffset.UtcDateTime
        //     value; otherwise, false.
        public
        static      bool                    operator ==
                                            (
                                                DateTimeOffset  left,
                                                DateTimeOffset  right
                                            )                                               { return left.value == right.value; }

        //
        // Summary:
        //     Determines whether one specified DeltaSpace.DateTimeOffset object is greater
        //     than (or later than) a second specified DeltaSpace.DateTimeOffset object.
        //
        // Parameters:
        //   left:
        //     The first object to compare.
        //
        //   right:
        //     The second object to compare.
        //
        // Returns:
        //     true if the DeltaSpace.DateTimeOffset.UtcDateTime value of left is later than
        //     the DeltaSpace.DateTimeOffset.UtcDateTime value of right; otherwise, false.
        public
        static      bool                    operator >
                                            (
                                                DateTimeOffset  left,
                                                DateTimeOffset  right
                                            )                                               { return left.value > right.value;}

        //
        // Summary:
        //     Determines whether one specified DeltaSpace.DateTimeOffset object is greater
        //     than or equal to a second specified DeltaSpace.DateTimeOffset object.
        //
        // Parameters:
        //   left:
        //     The first object to compare.
        //
        //   right:
        //     The second object to compare.
        //
        // Returns:
        //     true if the DeltaSpace.DateTimeOffset.UtcDateTime value of left is the same as
        //     or later than the DeltaSpace.DateTimeOffset.UtcDateTime value of right; otherwise,
        //     false.
        public
        static      bool                    operator >=
                                            (
                                                DateTimeOffset  left, 
                                                DateTimeOffset  right
                                            )                                               { return left.value >= right.value; }

        //
        // Summary:
        //     Defines an implicit conversion of a System.DateTime object to a DeltaSpace.DateTimeOffset
        //     object.
        //
        // Parameters:
        //   dateTime:
        //     The object to convert.
        //
        // Returns:
        //     The converted object.
        //
        // Exceptions:
        //   System.ArgumentOutOfRangeException:
        //     The Coordinated Universal Time (UTC) date and time that results from applying
        //     the offset is earlier than DeltaSpace.DateTimeOffset.MinValue.-or-The UTC date
        //     and time that results from applying the offset is later than DeltaSpace.DateTimeOffset.MaxValue.
        public
        static
        implicit                            operator DateTimeOffset(DateTime dateTime)      { return new DateTimeOffset(dateTime); }

        //
        // Summary:
        //     Defines an implicit conversion of a System.DateTime object to a DeltaSpace.DateTimeOffset
        //     object.
        //
        // Parameters:
        //   dateTime:
        //     The object to convert.
        //
        // Returns:
        //     The converted object.
        //
        // Exceptions:
        //   System.ArgumentOutOfRangeException:
        //     The Coordinated Universal Time (UTC) date and time that results from applying
        //     the offset is earlier than DeltaSpace.DateTimeOffset.MinValue.-or-The UTC date
        //     and time that results from applying the offset is later than DeltaSpace.DateTimeOffset.MaxValue.
        public
        static
        implicit                            operator DateTimeOffset
                                            (
                                                SystemDateTimeOffset dateTime
                                            )                                               { return new DateTimeOffset(dateTime); }

        //
        // Summary:
        //     Defines an implicit conversion of a System.DateTime object to a DeltaSpace.DateTimeOffset
        //     object.
        //
        // Parameters:
        //   dateTime:
        //     The object to convert.
        //
        // Returns:
        //     The converted object.
        //
        // Exceptions:
        //   System.ArgumentOutOfRangeException:
        //     The Coordinated Universal Time (UTC) date and time that results from applying
        //     the offset is earlier than DeltaSpace.DateTimeOffset.MinValue.-or-The UTC date
        //     and time that results from applying the offset is later than DeltaSpace.DateTimeOffset.MaxValue.
        public
        static
        implicit                            operator SystemDateTimeOffset
                                            (
                                                DateTimeOffset  dateTime
                                            )                                               { return dateTime.value; }

        // Summary:
        //     Gets a System.DateTime value that represents the date component of the current
        //     DeltaSpace.DateTimeOffset object.
        //
        // Returns:
        //     A System.DateTime value that represents the date component of the current
        //     DeltaSpace.DateTimeOffset object.
        public      DateTime                Date                                            { get { return this.value.Date; } }

        //
        // Summary:
        //     Gets a System.DateTime value that represents the date and time of the current
        //     DeltaSpace.DateTimeOffset object.
        //
        // Returns:
        //     The date and time of the current DeltaSpace.DateTimeOffset object.
        public      DateTime                DateTime                                        { get { return this.value.DateTime; } }

        //
        // Summary:
        //     Gets the day of the month represented by the current DeltaSpace.DateTimeOffset
        //     object.
        //
        // Returns:
        //     The day component of the current DeltaSpace.DateTimeOffset object, expressed
        //     as a value between 1 and 31.
        public      int                     Day                                             { get { return this.value.Day; } }

        //
        // Summary:
        //     Gets the day of the week represented by the current DeltaSpace.DateTimeOffset
        //     object.
        //
        // Returns:
        //     One of the enumeration values that indicates the day of the week of the current
        //     DeltaSpace.DateTimeOffset object.
        public      DayOfWeek               DayOfWeek                                       { get { return this.value.DayOfWeek; } }

        //
        // Summary:
        //     Gets the day of the year represented by the current DeltaSpace.DateTimeOffset
        //     object.
        //
        // Returns:
        //     The day of the year of the current DeltaSpace.DateTimeOffset object, expressed
        //     as a value between 1 and 366.
        public      int                     DayOfYear                                       { get { return this.value.DayOfYear; } }

        //
        // Summary:
        //     Gets the hour component of the time represented by the current DeltaSpace.DateTimeOffset
        //     object.
        //
        // Returns:
        //     The hour component of the current DeltaSpace.DateTimeOffset object. This property
        //     uses a 24-hour clock; the value ranges from 0 to 23.
        public      int                     Hour                                            { get { return this.value.Hour; } }

        //
        // Summary:
        //     Gets a System.DateTime value that represents the local date and time of the
        //     current DeltaSpace.DateTimeOffset object.
        //
        // Returns:
        //     The local date and time of the current DeltaSpace.DateTimeOffset object.
        public      DateTime                LocalDateTime                                   { get { return this.value.LocalDateTime; } }

        //
        // Summary:
        //     Gets the millisecond component of the time represented by the current DeltaSpace.DateTimeOffset
        //     object.
        //
        // Returns:
        //     The millisecond component of the current DeltaSpace.DateTimeOffset object, expressed
        //     as an integer between 0 and 999.
        public      int                     Millisecond                                     { get { return this.value.Millisecond; } }

        //
        // Summary:
        //     Gets the minute component of the time represented by the current DeltaSpace.DateTimeOffset
        //     object.
        //
        // Returns:
        //     The minute component of the current DeltaSpace.DateTimeOffset object, expressed
        //     as an integer between 0 and 59.
        public      int                     Minute                                          { get { return this.value.Minute; } }

        //
        // Summary:
        //     Gets the month component of the date represented by the current DeltaSpace.DateTimeOffset
        //     object.
        //
        // Returns:
        //     The month component of the current DeltaSpace.DateTimeOffset object, expressed
        //     as an integer between 1 and 12.
        public      int                     Month                                           { get { return this.value.Month; } }

        //
        // Summary:
        //     Gets a DeltaSpace.DateTimeOffset object that is set to the current date and time
        //     on the current computer, with the offset set to the local time's offset from
        //     Coordinated Universal Time (UTC).
        //
        // Returns:
        //     A DeltaSpace.DateTimeOffset object whose date and time is the current local time
        //     and whose offset is the local time zone's offset from Coordinated Universal
        //     Time (UTC).
        public
        static      DateTimeOffset          Now                                             { get { return SystemDateTimeOffset.Now.AddMinutes(DateTimeOffset.timeShift); } }

        //
        // Summary:
        //     Gets the time's offset from Coordinated Universal Time (UTC).
        //
        // Returns:
        //     The difference between the current DeltaSpace.DateTimeOffset object's time value
        //     and Coordinated Universal Time (UTC).
        public      TimeSpan                Offset                                          { get { return this.value.Offset; } }

        //
        // Summary:
        //     Gets the second component of the clock time represented by the current DeltaSpace.DateTimeOffset
        //     object.
        //
        // Returns:
        //     The second component of the DeltaSpace.DateTimeOffset object, expressed as an
        //     integer value between 0 and 59.
        public      int                     Second                                          { get { return this.value.Second; } }

        //
        // Summary:
        //     Gets the number of ticks that represents the date and time of the current
        //     DeltaSpace.DateTimeOffset object in clock time.
        //
        // Returns:
        //     The number of ticks in the DeltaSpace.DateTimeOffset object's clock time.
        public      long                    Ticks                                           { get { return this.value.Ticks; } }

        //
        // Summary:
        //     Gets the time of day for the current DeltaSpace.DateTimeOffset object.
        //
        // Returns:
        //     The time interval of the current date that has elapsed since midnight.
        public      TimeSpan                TimeOfDay                                       { get { return this.value.TimeOfDay; } }

        //
        // Summary:
        //     Gets a System.DateTime value that represents the Coordinated Universal Time
        //     (UTC) date and time of the current DeltaSpace.DateTimeOffset object.
        //
        // Returns:
        //     The Coordinated Universal Time (UTC) date and time of the current DeltaSpace.DateTimeOffset
        //     object.
        public      DateTime                UtcDateTime                                     { get { return this.value.UtcDateTime; } }

        //
        // Summary:
        //     Gets a DeltaSpace.DateTimeOffset object whose date and time are set to the current
        //     Coordinated Universal Time (UTC) date and time and whose offset is System.TimeSpan.Zero.
        //
        // Returns:
        //     An object whose date and time is the current Coordinated Universal Time (UTC)
        //     and whose offset is System.TimeSpan.Zero.
        public
        static      DateTimeOffset          UtcNow                                          { get { return new DateTimeOffset(SystemDateTimeOffset.UtcNow.AddMinutes(DateTimeOffset.timeShift)); } }

        //
        // Summary:
        //     Gets the number of ticks that represents the date and time of the current
        //     DeltaSpace.DateTimeOffset object in Coordinated Universal Time (UTC).
        //
        // Returns:
        //     The number of ticks in the DeltaSpace.DateTimeOffset object's Coordinated Universal
        //     Time (UTC).
        public      long                    UtcTicks                                        { get { return this.value.UtcTicks; } }

        //
        // Summary:
        //     Gets the year component of the date represented by the current DeltaSpace.DateTimeOffset
        //     object.
        //
        // Returns:
        //     The year component of the current DeltaSpace.DateTimeOffset object, expressed
        //     as an integer value between 0 and 9999.
        public      int                     Year                                            { get { return this.value.Year; } }

        // Summary:
        //     Adds a specified time interval to a DeltaSpace.DateTimeOffset object.
        //
        // Parameters:
        //   timeSpan:
        //     A System.TimeSpan object that represents a positive or a negative time interval.
        //
        // Returns:
        //     An object whose value is the sum of the date and time represented by the
        //     current DeltaSpace.DateTimeOffset object and the time interval represented by
        //     timeSpan.
        //
        // Exceptions:
        //   System.ArgumentOutOfRangeException:
        //     The resulting DeltaSpace.DateTimeOffset value is less than DeltaSpace.DateTimeOffset.MinValue.-or-
        //     The resulting DeltaSpace.DateTimeOffset value is greater than DeltaSpace.DateTimeOffset.MaxValue.
        public      DateTimeOffset          Add(TimeSpan timeSpan)                          { return new DateTimeOffset(this.value.Add(timeSpan)); }

        //
        // Summary:
        //     Adds a specified number of whole and fractional days to the current DeltaSpace.DateTimeOffset
        //     object.
        //
        // Parameters:
        //   days:
        //     A number of whole and fractional days. The number can be negative or positive.
        //
        // Returns:
        //     An object whose value is the sum of the date and time represented by the
        //     current DeltaSpace.DateTimeOffset object and the number of days represented by
        //     days.
        //
        // Exceptions:
        //   System.ArgumentOutOfRangeException:
        //     The resulting DeltaSpace.DateTimeOffset value is less than DeltaSpace.DateTimeOffset.MinValue.-or-
        //     The resulting DeltaSpace.DateTimeOffset value is greater than DeltaSpace.DateTimeOffset.MaxValue.
        public      DateTimeOffset          AddDays(double days)                            { return new DateTimeOffset(this.value.AddDays(days)); }

        //
        // Summary:
        //     Adds a specified number of whole and fractional hours to the current DeltaSpace.DateTimeOffset
        //     object.
        //
        // Parameters:
        //   hours:
        //     A number of whole and fractional hours. The number can be negative or positive.
        //
        // Returns:
        //     An object whose value is the sum of the date and time represented by the
        //     current DeltaSpace.DateTimeOffset object and the number of hours represented
        //     by hours.
        //
        // Exceptions:
        //   System.ArgumentOutOfRangeException:
        //     The resulting DeltaSpace.DateTimeOffset value is less than DeltaSpace.DateTimeOffset.MinValue.-or-
        //     The resulting DeltaSpace.DateTimeOffset value is greater than DeltaSpace.DateTimeOffset.MaxValue.
        public      DateTimeOffset          AddHours(double hours)                          { return new DateTimeOffset(this.value.AddHours(hours)); }

        //
        // Summary:
        //     Adds a specified number of milliseconds to the current DeltaSpace.DateTimeOffset
        //     object.
        //
        // Parameters:
        //   milliseconds:
        //     A number of whole and fractional milliseconds. The number can be negative
        //     or positive.
        //
        // Returns:
        //     An object whose value is the sum of the date and time represented by the
        //     current DeltaSpace.DateTimeOffset object and the number of whole milliseconds
        //     represented by milliseconds.
        //
        // Exceptions:
        //   System.ArgumentOutOfRangeException:
        //     The resulting DeltaSpace.DateTimeOffset value is less than DeltaSpace.DateTimeOffset.MinValue.-or-
        //     The resulting DeltaSpace.DateTimeOffset value is greater than DeltaSpace.DateTimeOffset.MaxValue.
        public      DateTimeOffset          AddMilliseconds(double milliseconds)            { return new DateTimeOffset(this.value.AddMilliseconds(milliseconds)); }

        //
        // Summary:
        //     Adds a specified number of whole and fractional minutes to the current DeltaSpace.DateTimeOffset
        //     object.
        //
        // Parameters:
        //   minutes:
        //     A number of whole and fractional minutes. The number can be negative or positive.
        //
        // Returns:
        //     An object whose value is the sum of the date and time represented by the
        //     current DeltaSpace.DateTimeOffset object and the number of minutes represented
        //     by minutes.
        //
        // Exceptions:
        //   System.ArgumentOutOfRangeException:
        //     The resulting DeltaSpace.DateTimeOffset value is less than DeltaSpace.DateTimeOffset.MinValue.-or-
        //     The resulting DeltaSpace.DateTimeOffset value is greater than DeltaSpace.DateTimeOffset.MaxValue.
        public      DateTimeOffset          AddMinutes(double minutes)                      { return new DateTimeOffset(this.value.AddMinutes(minutes)); }

        //
        // Summary:
        //     Adds a specified number of months to the current DeltaSpace.DateTimeOffset object.
        //
        // Parameters:
        //   months:
        //     A number of whole months. The number can be negative or positive.
        //
        // Returns:
        //     An object whose value is the sum of the date and time represented by the
        //     current DeltaSpace.DateTimeOffset object and the number of months represented
        //     by months.
        //
        // Exceptions:
        //   System.ArgumentOutOfRangeException:
        //     The resulting DeltaSpace.DateTimeOffset value is less than DeltaSpace.DateTimeOffset.MinValue.-or-
        //     The resulting DeltaSpace.DateTimeOffset value is greater than DeltaSpace.DateTimeOffset.MaxValue.
        public      DateTimeOffset          AddMonths(int months)                           { return new DateTimeOffset(this.value.AddMonths(months)); }

        //
        // Summary:
        //     Adds a specified number of whole and fractional seconds to the current DeltaSpace.DateTimeOffset
        //     object.
        //
        // Parameters:
        //   seconds:
        //     A number of whole and fractional seconds. The number can be negative or positive.
        //
        // Returns:
        //     An object whose value is the sum of the date and time represented by the
        //     current DeltaSpace.DateTimeOffset object and the number of seconds represented
        //     by seconds.
        //
        // Exceptions:
        //   System.ArgumentOutOfRangeException:
        //     The resulting DeltaSpace.DateTimeOffset value is less than DeltaSpace.DateTimeOffset.MinValue.-or-
        //     The resulting DeltaSpace.DateTimeOffset value is greater than DeltaSpace.DateTimeOffset.MaxValue.
        public      DateTimeOffset          AddSeconds(double seconds)                      { return new DateTimeOffset(this.value.AddSeconds(seconds)); }

        //
        // Summary:
        //     Adds a specified number of ticks to the current DeltaSpace.DateTimeOffset object.
        //
        // Parameters:
        //   ticks:
        //     A number of 100-nanosecond ticks. The number can be negative or positive.
        //
        // Returns:
        //     An object whose value is the sum of the date and time represented by the
        //     current DeltaSpace.DateTimeOffset object and the number of ticks represented
        //     by ticks.
        //
        // Exceptions:
        //   System.ArgumentOutOfRangeException:
        //     The resulting DeltaSpace.DateTimeOffset value is less than DeltaSpace.DateTimeOffset.MinValue.-or-
        //     The resulting DeltaSpace.DateTimeOffset value is greater than DeltaSpace.DateTimeOffset.MaxValue.
        public      DateTimeOffset          AddTicks(long ticks)                            { return new DateTimeOffset(this.value.AddTicks(ticks)); }

        //
        // Summary:
        //     Adds a specified number of years to the DeltaSpace.DateTimeOffset object.
        //
        // Parameters:
        //   years:
        //     A number of years. The number can be negative or positive.
        //
        // Returns:
        //     An object whose value is the sum of the date and time represented by the
        //     current DeltaSpace.DateTimeOffset object and the number of seconds represented
        //     by years.
        //
        // Exceptions:
        //   System.ArgumentOutOfRangeException:
        //     The resulting DeltaSpace.DateTimeOffset value is less than DeltaSpace.DateTimeOffset.MinValue.-or-
        //     The resulting DeltaSpace.DateTimeOffset value is greater than DeltaSpace.DateTimeOffset.MaxValue.
        public      DateTimeOffset          AddYears(int years)                             { return new DateTimeOffset(this.value.AddYears(years)); }

        //
        // Summary:
        //     Compares two DeltaSpace.DateTimeOffset objects and indicates whether the first
        //     is earlier than the second, equal to the second, or later than the second.
        //
        // Parameters:
        //   first:
        //     The first object to compare.
        //
        //   second:
        //     The second object to compare.
        //
        // Returns:
        //     A signed integer that indicates whether the value of the first parameter
        //     is earlier than, later than, or the same time as the value of the second
        //     parameter, as the following table shows.Return valueMeaningLess than zerofirst
        //     is earlier than second.Zerofirst is equal to second.Greater than zerofirst
        //     is later than second.
        public
        static      int                     Compare
                                            (
                                                DateTimeOffset  first,
                                                DateTimeOffset  second
                                            )                                               { return SystemDateTimeOffset.Compare(first.value, second.value); }

        //
        // Summary:
        //     Compares two DeltaSpace.DateTimeOffset objects and indicates whether the first
        //     is earlier than the second, equal to the second, or later than the second.
        //
        // Parameters:
        //   first:
        //     The first object to compare.
        //
        //   second:
        //     The second object to compare.
        //
        // Returns:
        //     A signed integer that indicates whether the value of the first parameter
        //     is earlier than, later than, or the same time as the value of the second
        //     parameter, as the following table shows.Return valueMeaningLess than zerofirst
        //     is earlier than second.Zerofirst is equal to second.Greater than zerofirst
        //     is later than second.
        public
        static      int                     Compare
                                            (
                                                SystemDateTimeOffset    first,
                                                DateTimeOffset          second
                                            )                                               { return SystemDateTimeOffset.Compare(first, second.value); }

        //
        // Summary:
        //     Compares two DeltaSpace.DateTimeOffset objects and indicates whether the first
        //     is earlier than the second, equal to the second, or later than the second.
        //
        // Parameters:
        //   first:
        //     The first object to compare.
        //
        //   second:
        //     The second object to compare.
        //
        // Returns:
        //     A signed integer that indicates whether the value of the first parameter
        //     is earlier than, later than, or the same time as the value of the second
        //     parameter, as the following table shows.Return valueMeaningLess than zerofirst
        //     is earlier than second.Zerofirst is equal to second.Greater than zerofirst
        //     is later than second.
        public
        static      int                     Compare
                                            (
                                                DateTimeOffset          first,
                                                SystemDateTimeOffset    second
                                            )                                               { return SystemDateTimeOffset.Compare(first.value, second); }

        //
        // Summary:
        //     Compares the current DeltaSpace.DateTimeOffset object to a specified DeltaSpace.DateTimeOffset
        //     object and indicates whether the current object is earlier than, the same
        //     as, or later than the second DeltaSpace.DateTimeOffset object.
        //
        // Parameters:
        //   other:
        //     An object to compare with the current DeltaSpace.DateTimeOffset object.
        //
        // Returns:
        //     A signed integer that indicates the relationship between the current DeltaSpace.DateTimeOffset
        //     object and other, as the following table shows.Return ValueDescriptionLess
        //     than zeroThe current DeltaSpace.DateTimeOffset object is earlier than other.ZeroThe
        //     current DeltaSpace.DateTimeOffset object is the same as other.Greater than zero.The
        //     current DeltaSpace.DateTimeOffset object is later than other.
        public      int                     CompareTo(DateTimeOffset other)                 { return this.value.CompareTo(other.value); }

        //
        // Summary:
        //     Compares the current DeltaSpace.DateTimeOffset object to a specified DeltaSpace.DateTimeOffset
        //     object and indicates whether the current object is earlier than, the same
        //     as, or later than the second DeltaSpace.DateTimeOffset object.
        //
        // Parameters:
        //   other:
        //     An object to compare with the current DeltaSpace.DateTimeOffset object.
        //
        // Returns:
        //     A signed integer that indicates the relationship between the current DeltaSpace.DateTimeOffset
        //     object and other, as the following table shows.Return ValueDescriptionLess
        //     than zeroThe current DeltaSpace.DateTimeOffset object is earlier than other.ZeroThe
        //     current DeltaSpace.DateTimeOffset object is the same as other.Greater than zero.The
        //     current DeltaSpace.DateTimeOffset object is later than other.
        public      int                     CompareTo(SystemDateTimeOffset other)           { return this.value.CompareTo(other); }

        //
        // Summary:
        //     Determines whether the current DeltaSpace.DateTimeOffset object represents the
        //     same point in time as a specified DeltaSpace.DateTimeOffset object.
        //
        // Parameters:
        //   other:
        //     An object to compare to the current DeltaSpace.DateTimeOffset object.
        //
        // Returns:
        //     true if both DeltaSpace.DateTimeOffset objects have the same DeltaSpace.DateTimeOffset.UtcDateTime
        //     value; otherwise, false.
        public      bool                    Equals(DateTimeOffset other)                    { return this.value.Equals(other.value); }

        //
        // Summary:
        //     Determines whether the current DeltaSpace.DateTimeOffset object represents the
        //     same point in time as a specified DeltaSpace.DateTimeOffset object.
        //
        // Parameters:
        //   other:
        //     An object to compare to the current DeltaSpace.DateTimeOffset object.
        //
        // Returns:
        //     true if both DeltaSpace.DateTimeOffset objects have the same DeltaSpace.DateTimeOffset.UtcDateTime
        //     value; otherwise, false.
        public      bool                    Equals(SystemDateTimeOffset other)              { return this.value.Equals(other); }

        //
        // Summary:
        //     Determines whether a DeltaSpace.DateTimeOffset object represents the same point
        //     in time as a specified object.
        //
        // Parameters:
        //   obj:
        //     The object to compare to the current DeltaSpace.DateTimeOffset object.
        //
        // Returns:
        //     true if the obj parameter is a DeltaSpace.DateTimeOffset object and represents
        //     the same point in time as the current DeltaSpace.DateTimeOffset object; otherwise,
        //     false.
        public
        override    bool                    Equals(object obj)                              { return this.value.Equals(obj); }

        //
        // Summary:
        //     Determines whether two specified DeltaSpace.DateTimeOffset objects represent
        //     the same point in time.
        //
        // Parameters:
        //   first:
        //     The first object to compare.
        //
        //   second:
        //     The second object to compare.
        //
        // Returns:
        //     true if the two DeltaSpace.DateTimeOffset objects have the same DeltaSpace.DateTimeOffset.UtcDateTime
        //     value; otherwise, false.
        public
        static      bool                    Equals
                                            (
                                                DateTimeOffset  first,
                                                DateTimeOffset  second
                                            )                                               { return SystemDateTimeOffset.Equals(first.value, second.value); }

        //
        // Summary:
        //     Determines whether two specified DeltaSpace.DateTimeOffset objects represent
        //     the same point in time.
        //
        // Parameters:
        //   first:
        //     The first object to compare.
        //
        //   second:
        //     The second object to compare.
        //
        // Returns:
        //     true if the two DeltaSpace.DateTimeOffset objects have the same DeltaSpace.DateTimeOffset.UtcDateTime
        //     value; otherwise, false.
        public
        static      bool                    Equals
                                            (
                                                SystemDateTimeOffset    first,
                                                DateTimeOffset          second
                                            )                                               { return SystemDateTimeOffset.Equals(first, second.value); }

        //
        // Summary:
        //     Determines whether two specified DeltaSpace.DateTimeOffset objects represent
        //     the same point in time.
        //
        // Parameters:
        //   first:
        //     The first object to compare.
        //
        //   second:
        //     The second object to compare.
        //
        // Returns:
        //     true if the two DeltaSpace.DateTimeOffset objects have the same DeltaSpace.DateTimeOffset.UtcDateTime
        //     value; otherwise, false.
        public
        static      bool                    Equals
                                            (
                                                DateTimeOffset          first,
                                                SystemDateTimeOffset    second
                                            )                                               { return SystemDateTimeOffset.Equals(first.value, second); }

        //
        // Summary:
        //     Determines whether the current DeltaSpace.DateTimeOffset object represents the
        //     same time and has the same offset as a specified DeltaSpace.DateTimeOffset object.
        //
        // Parameters:
        //   other:
        //     The object to compare to the current DeltaSpace.DateTimeOffset object.
        //
        // Returns:
        //     true if the current DeltaSpace.DateTimeOffset object and other have the same
        //     date and time value and the same DeltaSpace.DateTimeOffset.Offset value; otherwise,
        //     false.
        public      bool                    EqualsExact(DateTimeOffset other)               { return this.value.EqualsExact(other.value); }

        //
        // Summary:
        //     Determines whether the current DeltaSpace.DateTimeOffset object represents the
        //     same time and has the same offset as a specified DeltaSpace.DateTimeOffset object.
        //
        // Parameters:
        //   other:
        //     The object to compare to the current DeltaSpace.DateTimeOffset object.
        //
        // Returns:
        //     true if the current DeltaSpace.DateTimeOffset object and other have the same
        //     date and time value and the same DeltaSpace.DateTimeOffset.Offset value; otherwise,
        //     false.
        public      bool                    EqualsExact(SystemDateTimeOffset other)         { return this.value.EqualsExact(other); }
        
        //
        // Summary:
        //     Converts the specified Windows file time to an equivalent local time.
        //
        // Parameters:
        //   fileTime:
        //     A Windows file time, expressed in ticks.
        //
        // Returns:
        //     An object that represents the date and time of fileTime with the offset set
        //     to the local time offset.
        //
        // Exceptions:
        //   System.ArgumentOutOfRangeException:
        //     filetime is less than zero.-or-filetime is greater than DateTimeOffset.MaxValue.Ticks.
        public
        static      DateTimeOffset          FromFileTime(long fileTime)                     { return new DateTimeOffset(SystemDateTimeOffset.FromFileTime(fileTime)); }

        //
        // Summary:
        //     Returns the hash code for the current DeltaSpace.DateTimeOffset object.
        //
        // Returns:
        //     A 32-bit signed integer hash code.
        public
        override    int                     GetHashCode()                                   { return this.value.GetHashCode(); }

        //
        // Summary:
        //     Converts the specified string representation of a date, time, and offset
        //     to its DeltaSpace.DateTimeOffset equivalent.
        //
        // Parameters:
        //   input:
        //     A string that contains a date and time to convert.
        //
        // Returns:
        //     An object that is equivalent to the date and time that is contained in input.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     The offset is greater than 14 hours or less than -14 hours.
        //
        //   System.ArgumentNullException:
        //     input is null.
        //
        //   System.FormatException:
        //     input does not contain a valid string representation of a date and time.-or-input
        //     contains the string representation of an offset value without a date or time.
        [SecuritySafeCritical]
        public
        static      DateTimeOffset          Parse(string input)                             { return new DateTimeOffset(SystemDateTimeOffset.Parse(input)); }

        //
        // Summary:
        //     Converts the specified string representation of a date and time to its DeltaSpace.DateTimeOffset
        //     equivalent using the specified culture-specific format information.
        //
        // Parameters:
        //   input:
        //     A string that contains a date and time to convert.
        //
        //   formatProvider:
        //     An object that provides culture-specific format information about input.
        //
        // Returns:
        //     An object that is equivalent to the date and time that is contained in input,
        //     as specified by formatProvider.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     The offset is greater than 14 hours or less than -14 hours.
        //
        //   System.ArgumentNullException:
        //     input is null.
        //
        //   System.FormatException:
        //     input does not contain a valid string representation of a date and time.-or-input
        //     contains the string representation of an offset value without a date or time.
        public
        static      DateTimeOffset          Parse
                                            (
                                                string          input,
                                                IFormatProvider formatProvider
                                            )                                               { return new DateTimeOffset(SystemDateTimeOffset.Parse(input, formatProvider)); }

        //
        // Summary:
        //     Converts the specified string representation of a date and time to its DeltaSpace.DateTimeOffset
        //     equivalent using the specified culture-specific format information and formatting
        //     style.
        //
        // Parameters:
        //   input:
        //     A string that contains a date and time to convert.
        //
        //   formatProvider:
        //     An object that provides culture-specific format information about input.
        //
        //   styles:
        //     A bitwise combination of enumeration values that indicates the permitted
        //     format of input. A typical value to specify is System.Globalization.DateTimeStyles.None.
        //
        // Returns:
        //     An object that is equivalent to the date and time that is contained in input
        //     as specified by formatProvider and styles.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     The offset is greater than 14 hours or less than -14 hours.-or-styles is
        //     not a valid System.Globalization.DateTimeStyles value.-or-styles includes
        //     an unsupported System.Globalization.DateTimeStyles value.-or-styles includes
        //     System.Globalization.DateTimeStyles values that cannot be used together.
        //
        //   System.ArgumentNullException:
        //     input is null.
        //
        //   System.FormatException:
        //     input does not contain a valid string representation of a date and time.-or-input
        //     contains the string representation of an offset value without a date or time.
        [SecuritySafeCritical]
        public
        static      DateTimeOffset          Parse
                                            (
                                                string          input, 
                                                IFormatProvider formatProvider, 
                                                DateTimeStyles  styles
                                            )                                               { return new DateTimeOffset(SystemDateTimeOffset.Parse(input, formatProvider, styles)); }

        //
        // Summary:
        //     Converts the specified string representation of a date and time to its DeltaSpace.DateTimeOffset
        //     equivalent using the specified format and culture-specific format information.
        //     The format of the string representation must match the specified format exactly.
        //
        // Parameters:
        //   input:
        //     A string that contains a date and time to convert.
        //
        //   format:
        //     A format specifier that defines the expected format of input.
        //
        //   formatProvider:
        //     An object that supplies culture-specific formatting information about input.
        //
        // Returns:
        //     An object that is equivalent to the date and time that is contained in input
        //     as specified by format and formatProvider.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     The offset is greater than 14 hours or less than -14 hours.
        //
        //   System.ArgumentNullException:
        //     input is null.-or-format is null.
        //
        //   System.FormatException:
        //     input is an empty string ("").-or-input does not contain a valid string representation
        //     of a date and time.-or-format is an empty string.-or-The hour component and
        //     the AM/PM designator in input do not agree.
        public
        static      DateTimeOffset          ParseExact
                                            (
                                                string          input,
                                                string          format, 
                                                IFormatProvider formatProvider
                                            )                                               { return new DateTimeOffset(SystemDateTimeOffset.ParseExact(input, format, formatProvider)); }

        //
        // Summary:
        //     Converts the specified string representation of a date and time to its DeltaSpace.DateTimeOffset
        //     equivalent using the specified format, culture-specific format information,
        //     and style. The format of the string representation must match the specified
        //     format exactly.
        //
        // Parameters:
        //   input:
        //     A string that contains a date and time to convert.
        //
        //   format:
        //     A format specifier that defines the expected format of input.
        //
        //   formatProvider:
        //     An object that supplies culture-specific formatting information about input.
        //
        //   styles:
        //     A bitwise combination of enumeration values that indicates the permitted
        //     format of input.
        //
        // Returns:
        //     An object that is equivalent to the date and time that is contained in the
        //     input parameter, as specified by the format, formatProvider, and styles parameters.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     The offset is greater than 14 hours or less than -14 hours.-or-The styles
        //     parameter includes an unsupported value.-or-The styles parameter contains
        //     System.Globalization.DateTimeStyles values that cannot be used together.
        //
        //   System.ArgumentNullException:
        //     input is null.-or-format is null.
        //
        //   System.FormatException:
        //     input is an empty string ("").-or-input does not contain a valid string representation
        //     of a date and time.-or-format is an empty string.-or-The hour component and
        //     the AM/PM designator in input do not agree.
        public
        static      DateTimeOffset          ParseExact
                                            (
                                                string          input, 
                                                string          format, 
                                                IFormatProvider formatProvider, 
                                                DateTimeStyles  styles
                                            )                                               { return new DateTimeOffset(SystemDateTimeOffset.ParseExact(input, format, formatProvider, styles)); }

        //
        // Summary:
        //     Converts the specified string representation of a date and time to its DeltaSpace.DateTimeOffset
        //     equivalent using the specified formats, culture-specific format information,
        //     and style. The format of the string representation must match one of the
        //     specified formats exactly.
        //
        // Parameters:
        //   input:
        //     A string that contains a date and time to convert.
        //
        //   formats:
        //     An array of format specifiers that define the expected formats of input.
        //
        //   formatProvider:
        //     An object that supplies culture-specific formatting information about input.
        //
        //   styles:
        //     A bitwise combination of enumeration values that indicates the permitted
        //     format of input.
        //
        // Returns:
        //     An object that is equivalent to the date and time that is contained in the
        //     input parameter, as specified by the formats, formatProvider, and styles
        //     parameters.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     The offset is greater than 14 hours or less than -14 hours.-or-styles includes
        //     an unsupported value.-or-The styles parameter contains System.Globalization.DateTimeStyles
        //     values that cannot be used together.
        //
        //   System.ArgumentNullException:
        //     input is null.
        //
        //   System.FormatException:
        //     input is an empty string ("").-or-input does not contain a valid string representation
        //     of a date and time.-or-No element of formats contains a valid format specifier.-or-The
        //     hour component and the AM/PM designator in input do not agree.
        public
        static      DateTimeOffset          ParseExact
                                            (
                                                string          input, 
                                                string[]        formats, 
                                                IFormatProvider formatProvider,
                                                DateTimeStyles  styles
                                            )                                               { return new DateTimeOffset(SystemDateTimeOffset.ParseExact(input, formats, formatProvider, styles)); }

        //
        // Summary:
        //     Subtracts a DeltaSpace.DateTimeOffset value that represents a specific date and
        //     time from the current DeltaSpace.DateTimeOffset object.
        //
        // Parameters:
        //   value:
        //     An object that represents the value to subtract.
        //
        // Returns:
        //     An object that specifies the interval between the two DeltaSpace.DateTimeOffset
        //     objects.
        public      TimeSpan                Subtract(DateTimeOffset value)                  { return this.value.Subtract(value.value); }

        //
        // Summary:
        //     Subtracts a DeltaSpace.DateTimeOffset value that represents a specific date and
        //     time from the current DeltaSpace.DateTimeOffset object.
        //
        // Parameters:
        //   value:
        //     An object that represents the value to subtract.
        //
        // Returns:
        //     An object that specifies the interval between the two DeltaSpace.DateTimeOffset
        //     objects.
        public      TimeSpan                Subtract(SystemDateTimeOffset value)            { return this.value.Subtract(value); }

        //
        // Summary:
        //     Subtracts a specified time interval from the current DeltaSpace.DateTimeOffset
        //     object.
        //
        // Parameters:
        //   value:
        //     The time interval to subtract.
        //
        // Returns:
        //     An object that is equal to the date and time represented by the current DeltaSpace.DateTimeOffset
        //     object, minus the time interval represented by value.
        //
        // Exceptions:
        //   System.ArgumentOutOfRangeException:
        //     The resulting DeltaSpace.DateTimeOffset value is less than DeltaSpace.DateTimeOffset.MinValue.-or-
        //     The resulting DeltaSpace.DateTimeOffset value is greater than DeltaSpace.DateTimeOffset.MaxValue.
        public      DateTimeOffset          Subtract(TimeSpan value)                        { return new DateTimeOffset(this.value.Subtract(value)); }

        //
        // Summary:
        //     Converts the value of the current DeltaSpace.DateTimeOffset object to a Windows
        //     file time.
        //
        // Returns:
        //     The value of the current DeltaSpace.DateTimeOffset object, expressed as a Windows
        //     file time.
        //
        // Exceptions:
        //   System.ArgumentOutOfRangeException:
        //     The resulting file time would represent a date and time before midnight on
        //     January 1, 1601 C.E. Coordinated Universal Time (UTC).
        public      long                    ToFileTime()                                    { return this.value.ToFileTime(); }

        //
        // Summary:
        //     Converts the current DeltaSpace.DateTimeOffset object to a DeltaSpace.DateTimeOffset
        //     object that represents the local time.
        //
        // Returns:
        //     An object that represents the date and time of the current DeltaSpace.DateTimeOffset
        //     object converted to local time.
        public      DateTimeOffset          ToLocalTime()                                   { return new DateTimeOffset(this.value.ToLocalTime()); }

        //
        // Summary:
        //     Converts the value of the current DeltaSpace.DateTimeOffset object to the date
        //     and time specified by an offset value.
        //
        // Parameters:
        //   offset:
        //     The offset to convert the DeltaSpace.DateTimeOffset value to.
        //
        // Returns:
        //     An object that is equal to the original DeltaSpace.DateTimeOffset object (that
        //     is, their DeltaSpace.DateTimeOffset.ToUniversalTime() methods return identical
        //     points in time) but whose DeltaSpace.DateTimeOffset.Offset property is set to
        //     offset.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     The resulting DeltaSpace.DateTimeOffset object has a DeltaSpace.DateTimeOffset.DateTime
        //     value earlier than DeltaSpace.DateTimeOffset.MinValue.-or-The resulting DeltaSpace.DateTimeOffset
        //     object has a DeltaSpace.DateTimeOffset.DateTime value later than DeltaSpace.DateTimeOffset.MaxValue.
        //
        //   System.ArgumentOutOfRangeException:
        //     offset is less than -14 hours.-or-offset is greater than 14 hours.
        public      DateTimeOffset          ToOffset(TimeSpan offset)                       { return new DateTimeOffset(this.value.ToOffset(offset)); }

        //
        // Summary:
        //     Converts the value of the current DeltaSpace.DateTimeOffset object to its equivalent
        //     string representation.
        //
        // Returns:
        //     A string representation of a DeltaSpace.DateTimeOffset object that includes the
        //     offset appended at the end of the string.
        [SecuritySafeCritical]
        public
        override    string                  ToString()                                      { return this.value.ToString(); }

        //
        // Summary:
        //     Converts the value of the current DeltaSpace.DateTimeOffset object to its equivalent
        //     string representation using the specified culture-specific formatting information.
        //
        // Parameters:
        //   formatProvider:
        //     An object that supplies culture-specific formatting information.
        //
        // Returns:
        //     A string representation of the value of the current DeltaSpace.DateTimeOffset
        //     object, as specified by formatProvider.
        [SecuritySafeCritical]
        public      string                  ToString(IFormatProvider formatProvider)        { return this.value.ToString(formatProvider); }

        //
        // Summary:
        //     Converts the value of the current DeltaSpace.DateTimeOffset object to its equivalent
        //     string representation using the specified format.
        //
        // Parameters:
        //   format:
        //     A format string.
        //
        // Returns:
        //     A string representation of the value of the current DeltaSpace.DateTimeOffset
        //     object, as specified by format.
        //
        // Exceptions:
        //   System.FormatException:
        //     The length of format is one, and it is not one of the standard format specifier
        //     characters defined for System.Globalization.DateTimeFormatInfo. -or-format
        //     does not contain a valid custom format pattern.
        [SecuritySafeCritical]
        public      string                  ToString(string format)                         { return this.value.ToString(format); }

        //
        // Summary:
        //     Converts the value of the current DeltaSpace.DateTimeOffset object to its equivalent
        //     string representation using the specified format and culture-specific format
        //     information.
        //
        // Parameters:
        //   format:
        //     A format string.
        //
        //   formatProvider:
        //     An object that supplies culture-specific formatting information.
        //
        // Returns:
        //     A string representation of the value of the current DeltaSpace.DateTimeOffset
        //     object, as specified by format and provider.
        //
        // Exceptions:
        //   System.FormatException:
        //     The length of format is one, and it is not one of the standard format specifier
        //     characters defined for System.Globalization.DateTimeFormatInfo.-or-format
        //     does not contain a valid custom format pattern.
        [SecuritySafeCritical]
        public      string                  ToString
                                            (
                                                string          format, 
                                                IFormatProvider formatProvider
                                            )                                               { return this.value.ToString(format, formatProvider); }

        //
        // Summary:
        //     Converts the current DeltaSpace.DateTimeOffset object to a DeltaSpace.DateTimeOffset
        //     value that represents the Coordinated Universal Time (UTC).
        //
        // Returns:
        //     An object that represents the date and time of the current DeltaSpace.DateTimeOffset
        //     object converted to Coordinated Universal Time (UTC).
        public      DateTimeOffset          ToUniversalTime()                               { return new DateTimeOffset(this.value.ToUniversalTime()); }

        //
        // Summary:
        //     Tries to converts a specified string representation of a date and time to
        //     its DeltaSpace.DateTimeOffset equivalent, and returns a value that indicates
        //     whether the conversion succeeded.
        //
        // Parameters:
        //   input:
        //     A string that contains a date and time to convert.
        //
        //   result:
        //     When the method returns, contains the DeltaSpace.DateTimeOffset equivalent to
        //     the date and time of input, if the conversion succeeded, or DeltaSpace.DateTimeOffset.MinValue,
        //     if the conversion failed. The conversion fails if the input parameter is
        //     null or does not contain a valid string representation of a date and time.
        //     This parameter is passed uninitialized.
        //
        // Returns:
        //     true if the input parameter is successfully converted; otherwise, false.
        [SecuritySafeCritical]
        public
        static      bool                    TryParse
                                            (
                                                string          input, 
                                            out DateTimeOffset  result
                                            )
        {
            SystemDateTimeOffset    systemResult;
            bool                    success         = SystemDateTimeOffset.TryParse(input, out systemResult);
            result  = new DateTimeOffset(systemResult);
            return success;
        }

        //
        // Summary:
        //     Tries to convert a specified string representation of a date and time to
        //     its DeltaSpace.DateTimeOffset equivalent, and returns a value that indicates
        //     whether the conversion succeeded.
        //
        // Parameters:
        //   input:
        //     A string that contains a date and time to convert.
        //
        //   formatProvider:
        //     An object that provides culture-specific formatting information about input.
        //
        //   styles:
        //     A bitwise combination of enumeration values that indicates the permitted
        //     format of input.
        //
        //   result:
        //     When the method returns, contains the DeltaSpace.DateTimeOffset value equivalent
        //     to the date and time of input, if the conversion succeeded, or DeltaSpace.DateTimeOffset.MinValue,
        //     if the conversion failed. The conversion fails if the input parameter is
        //     null or does not contain a valid string representation of a date and time.
        //     This parameter is passed uninitialized.
        //
        // Returns:
        //     true if the input parameter is successfully converted; otherwise, false.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     styles includes an undefined System.Globalization.DateTimeStyles value.-or-System.Globalization.DateTimeStyles.NoCurrentDateDefault
        //     is not supported.-or-styles includes mutually exclusive System.Globalization.DateTimeStyles
        //     values.
        [SecuritySafeCritical]
        public
        static      bool                    TryParse
                                            (
                                                string          input, 
                                                IFormatProvider formatProvider, 
                                                DateTimeStyles  styles, 
                                            out DateTimeOffset  result
                                            )
        {
            SystemDateTimeOffset    systemResult;
            bool                    success         = SystemDateTimeOffset.TryParse(input, formatProvider, styles, out systemResult);
            result  = new DateTimeOffset(systemResult);
            return success;
        }

        //
        // Summary:
        //     Converts the specified string representation of a date and time to its DeltaSpace.DateTimeOffset
        //     equivalent using the specified format, culture-specific format information,
        //     and style. The format of the string representation must match the specified
        //     format exactly.
        //
        // Parameters:
        //   input:
        //     A string that contains a date and time to convert.
        //
        //   format:
        //     A format specifier that defines the required format of input.
        //
        //   formatProvider:
        //     An object that supplies culture-specific formatting information about input.
        //
        //   styles:
        //     A bitwise combination of enumeration values that indicates the permitted
        //     format of input. A typical value to specify is None.
        //
        //   result:
        //     When the method returns, contains the DeltaSpace.DateTimeOffset equivalent to
        //     the date and time of input, if the conversion succeeded, or DeltaSpace.DateTimeOffset.MinValue,
        //     if the conversion failed. The conversion fails if the input parameter is
        //     null, or does not contain a valid string representation of a date and time
        //     in the expected format defined by format and provider. This parameter is
        //     passed uninitialized.
        //
        // Returns:
        //     true if the input parameter is successfully converted; otherwise, false.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     styles includes an undefined System.Globalization.DateTimeStyles value.-or-System.Globalization.DateTimeStyles.NoCurrentDateDefault
        //     is not supported.-or-styles includes mutually exclusive System.Globalization.DateTimeStyles
        //     values.
        public
        static      bool                    TryParseExact
                                            (
                                                string          input, 
                                                string          format, 
                                                IFormatProvider formatProvider, 
                                                DateTimeStyles  styles, 
                                            out DateTimeOffset  result
                                            )
        {
            SystemDateTimeOffset    systemResult;
            bool                    success         = SystemDateTimeOffset.TryParseExact(input, format, formatProvider, styles, out systemResult);
            result  = new DateTimeOffset(systemResult);
            return success;
        }

        //
        // Summary:
        //     Converts the specified string representation of a date and time to its DeltaSpace.DateTimeOffset
        //     equivalent using the specified array of formats, culture-specific format
        //     information, and style. The format of the string representation must match
        //     one of the specified formats exactly.
        //
        // Parameters:
        //   input:
        //     A string that contains a date and time to convert.
        //
        //   formats:
        //     An array that defines the expected formats of input.
        //
        //   formatProvider:
        //     An object that supplies culture-specific formatting information about input.
        //
        //   styles:
        //     A bitwise combination of enumeration values that indicates the permitted
        //     format of input. A typical value to specify is None.
        //
        //   result:
        //     When the method returns, contains the DeltaSpace.DateTimeOffset equivalent to
        //     the date and time of input, if the conversion succeeded, or DeltaSpace.DateTimeOffset.MinValue,
        //     if the conversion failed. The conversion fails if the input does not contain
        //     a valid string representation of a date and time, or does not contain the
        //     date and time in the expected format defined by format, or if formats is
        //     null. This parameter is passed uninitialized.
        //
        // Returns:
        //     true if the input parameter is successfully converted; otherwise, false.
        //
        // Exceptions:
        //   System.ArgumentException:
        //     styles includes an undefined System.Globalization.DateTimeStyles value.-or-System.Globalization.DateTimeStyles.NoCurrentDateDefault
        //     is not supported.-or-styles includes mutually exclusive System.Globalization.DateTimeStyles
        //     values.
        public
        static      bool                    TryParseExact
                                            (
                                                string          input, 
                                                string[]        formats, 
                                                IFormatProvider formatProvider, 
                                                DateTimeStyles  styles, 
                                            out DateTimeOffset  result
                                            )
        {
            SystemDateTimeOffset    systemResult;
            bool                    success         = SystemDateTimeOffset.TryParseExact(input, formats, formatProvider, styles, out systemResult);
            result  = new DateTimeOffset(systemResult);
            return success;
        }

        #region IComparable Members

                    int                     IComparable.CompareTo(object obj)               { return ((IComparable) this.value).CompareTo(obj); }

        #endregion

        #region ISerializable Members

                    void                    ISerializable.GetObjectData
                                            (
                                                SerializationInfo   info, 
                                                StreamingContext    context
                                            )                                               { ((ISerializable) this.value).GetObjectData(info, context); }

        #endregion

        #region IDeserializationCallback Members

                    void                    IDeserializationCallback.OnDeserialization
                                            (
                                                object  sender
                                            )                                               { ((IDeserializationCallback) this.value).OnDeserialization(sender); }

        #endregion

    }

}
